import { Command, flags } from "@oclif/command";
import * as chalk from "chalk";
import * as playwright from "playwright";
import * as path from "path";
import * as fs from "fs";

export default class Build extends Command {
  static description = "build feature library";

  static examples = [
    `$ sveature build
    building feature library
    `,
  ];

  static flags = {
    static: flags.boolean({
      char: "s",
      description: "generate static HTML (experimental)",
    }),
  };

  async run() {
    const { flags } = this.parse(Build);
    const configPath = path.join(process.cwd(), "sveature.config.js");
    const config: any = {
      dev: false,
      serve: flags.static,
      port: 10001,
      screenshots: false,
    };
    if (fs.existsSync(configPath)) {
      Object.assign(config, require(configPath));
    }

    const rollupConfig = require("../../rollup")(config);
    const rollup = require("rollup");
    this.log(
      chalk.cyan("⌚ Building Sveature"),
      flags.static ? chalk.green("(static)") : ""
    );
    const bundle = await rollup.rollup(rollupConfig);
    await bundle.write(rollupConfig.output);
    this.log(chalk.green("✔ Build completed"));

    if (flags.static) {
      this.log(chalk.cyan("⌚ Rendering Static Content"));
      const browser = await playwright.chromium.launch();
      const context = await browser.newContext();

      const baseUrl = `http://localhost:${config.port}`;
      const scannedLinks: string[] = [];
      const pendingLinks: string[] = ["/"];

      const scanLink = async (url: string) => {
        let pathname = url.replace(baseUrl, "");
        pathname = ["", "/"].includes(pathname) ? "/index" : pathname;
        if (scannedLinks.includes(pathname)) {
          return;
        }
        this.log(`@ ${pathname}`);
        const page = await context.newPage();
        await page.goto(`${baseUrl}${pathname === "/index" ? "/" : pathname}`);
        const links = (
          await page.evaluate(() => {
            const hrefs: string[] = [];
            document.querySelectorAll("a").forEach((el) => {
              hrefs.push(el.href);
            });
            return [...new Set(hrefs)];
          })
        )
          .filter((href) => href.indexOf(baseUrl) === 0)
          .map((href) => {
            const linkPath = href.replace(baseUrl, "");
            return ["", "/"].includes(linkPath) ? "/index" : linkPath;
          });

        links.forEach((link: string) => {
          if (
            link &&
            !scannedLinks.includes(link) &&
            !pendingLinks.includes(link)
          ) {
            pendingLinks.push(link);
          }
        });

        if (config.screenshots) {
          await page.screenshot({
            path: path.join(config.dir, `screenshots/${pathname}.png`),
          });
        }

        // Save the content
        const content = (await page.content())
          .replace(/href="([^"]+)"/g, (all, path) =>
            path.indexOf("http") === 0
              ? `href="${path}"`
              : `href="/docs${path === "/" ? "/index" : path}.html"`
          )
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(
            /(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g,
            "$1$3"
          );
        const filename = path.join(
          path.resolve(process.cwd(), config.dir),
          "static/",
          `${pathname}.html`
        );
        const dir = path.dirname(filename);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        fs.writeFileSync(filename, content);
        this.log(`==> ${filename}`);
        this.log();
        scannedLinks.push(pathname);
      };

      while (pendingLinks.length) {
        const url = pendingLinks.shift();
        if (url) {
          await scanLink(url);
        }
      }

      await browser.close();
    }

    this.exit(0);
  }
}
