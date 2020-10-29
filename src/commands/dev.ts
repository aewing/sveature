/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
import { Command } from "@oclif/command";
import * as rollup from "rollup";
import * as chalk from "chalk";

export default class Hello extends Command {
  static description = "start feature library in development mode";

  static examples = [
    `$ sveature dev
    Starting Sveature in development mode
    `,
  ];

  async run() {
    const fs = require("fs");
    const path = require("path");

    const configPath = path.join(process.cwd(), "sveature.config.js");
    const config: any = {};
    if (fs.existsSync(configPath)) {
      Object.assign(config, require(configPath));
    }
    const rollupConfig = require("../../rollup")(config);

    this.log("Starting Sveature in development mode");
    const watcher = rollup.watch({
      ...rollupConfig,
      watch: {
        exclude: ["node_modules/**", "docs/dist/**"],
        include: [
          path.join(process.cwd(), config.dir || "docs/", "src/"),
          path.join(
            process.cwd(),
            config.pattern || "src/**/features/*.svelte"
          ),
        ],
      },
    });

    const end = (code = 0) => {
      watcher.close();
      process.exit(code);
    };

    watcher.on("event", (event: any) => {
      if (event.code === "BUNDLE_START") {
        this.log(chalk.cyan("⌚ Bundling"));
      } else if (event.code === "BUNDLE_END") {
        this.log(chalk.green("✔ Bundled"));
      } else if (event.code === "ERROR") {
        this.log(chalk.red("❌ Failed"));
        if (
          event.error.message.indexOf("Could not resolve entry module") === 0
        ) {
          this.log(
            chalk.red(
              "❌ The entry module provided to rollup does not exist. Did you run 'sveature init'?"
            )
          );
          end(1);
        } else {
          this.log(chalk.red("❌", event.error.message));
          end(2);
        }
      }
    });
  }
}
