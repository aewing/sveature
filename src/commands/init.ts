/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
/* eslint-disable unicorn/catch-error-name */
import { Command, flags } from "@oclif/command";
import cli from "cli-ux";
import * as chalk from "chalk";

export default class Init extends Command {
  static description = "initialize sveature in a new or existing project";

  static examples = [`$ sveature init`];

  static flags = {
    dir: flags.string({
      char: "d",
      description: "directory of sveature project",
    }),
    pattern: flags.string({
      char: "p",
      description: "pattern for feature file matching",
    }),
  };

  async run() {
    const fs = require("fs-extra");
    const path = require("path");
    const spawn = require("cross-spawn");

    let invalidPackageConfiguration = false;

    if (fs.existsSync(path.join(process.cwd(), "package.json"))) {
      let pkg;
      try {
        pkg = JSON.parse(
          fs.readFileSync(path.join(process.cwd(), "package.json")).toString()
        );
      } catch (e) {
        this.log(chalk.red("💀 ERROR: Failed to parse package.json"));
        this.error(e);
      }
      invalidPackageConfiguration =
        !pkg ||
        [
          Boolean(pkg.dependencies?.svelte || pkg.devDependencies?.svelte),
          Boolean(pkg.dependencies?.rollup || pkg.devDependencies?.rollup),
        ].includes(false);
    } else {
      this.log(chalk.yellow("⚠ WARNING: no package.json detected"));

      const initSapper = await cli.confirm(
        "Would you like to initialize a Sapper project in this directory?"
      );

      if (initSapper) {
        this.log(chalk.cyan("⌚ Installing Sapper"));
        spawn.sync("npx", [
          "degit",
          "sveltejs/sapper-template#rollup",
          ".",
          "--force",
        ]);
        spawn.sync("node", ["scripts/setupTypeScript.js"]);
        spawn.sync("yarn", ["install"]);
      } else {
        invalidPackageConfiguration = true;
      }
    }

    if (invalidPackageConfiguration) {
      this.error(
        chalk.red(
          "💀 ERROR: Invalid package configuration. Svelte and Rollup must be required as dependencies or devDependencies."
        )
      );
    } else {
      this.log(
        chalk.cyan("⌚ Upgrading packages & installing testing utilities")
      );
      spawn.sync("yarn", ["upgrade"]);
      spawn.sync("yarn", [
        "add",
        "-D",
        "@testing-library/dom",
        "@testing-library/svelte",
        "jest",
        "ts-jest",
        "svelte-jester",
        "svelte-htm",
        "@testing-library/jest-dom",
        "postcss",
        "postcss-preset-env",
        "postcss-font-magician@^2.3.1",
        "sveature",
      ]);
      const pkg = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "package.json")).toString()
      );
      pkg.jest = {
        transform: {
          "^.+\\.svelte$": [
            "svelte-jester",
            {
              preprocess: true,
            },
          ],
          "^.+\\.ts$": "ts-jest",
        },
        moduleFileExtensions: ["js", "ts", "svelte"],
      };
      fs.writeFileSync(
        path.join(process.cwd(), "package.json"),
        JSON.stringify(pkg, null, 2)
      );
    }

    if (fs.existsSync(path.join(process.cwd(), "sveature.config.js"))) {
      this.log(
        chalk.yellow(
          "⚠ WARNING: sveature.config.js detected. Proceeding will overwrite this file."
        )
      );
      const confirmed = await cli.confirm("Are you sure? [y/n]");
      if (!confirmed) {
        process.exit();
      }
    }

    const { flags } = this.parse(Init);

    let dir = flags.dir;
    if (!dir) {
      dir = await cli.prompt(
        "Where do you want to store sveature src and dist?",
        {
          default: "docs/",
        }
      );
    }

    let pattern = flags.pattern;
    if (!pattern) {
      pattern = await cli.prompt(
        "Where do you want to store your feature files?",
        { default: "src/**/features/*.svelte" }
      );
    }

    const directory = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    fs.writeFileSync(
      path.join(process.cwd(), "sveature.config.js"),
      `module.exports = { dir: "${dir}", pattern: "${pattern}" };`
    );

    // copy docs scaffold
    fs.copySync(path.resolve(__dirname, "../scaffold/docs"), directory);
    fs.copySync(
      path.resolve(__dirname, "../scaffold/svelte.config.js"),
      path.join(process.cwd(), "svelte.config.js")
    );
    fs.copySync(
      path.resolve(__dirname, "../scaffold/postcss.config.js"),
      path.join(process.cwd(), "postcss.config.js")
    );
    this.log(chalk.green("✔ Project configured."));
  }
}
