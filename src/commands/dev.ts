/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
import { Command } from "@oclif/command";
import * as rollup from "rollup";
import * as chalk from "chalk";

export default class Dev extends Command {
  static description = "start feature library in development mode";

  static examples = [
    `$ sveature dev
    Starting Sveature in development mode
    `,
  ];

  async run() {
    const fs = require("fs");
    const path = require("path");
    const chokidar = require("chokidar");

    const configPath = path.join(process.cwd(), "sveature.config.js");
    const config: any = {};
    if (fs.existsSync(configPath)) {
      Object.assign(config, require(configPath));
    }
    const rollupConfig = require("../../rollup")(config);
    const watcherConfig = {
      ...rollupConfig,
      watch: {
        exclude: ["node_modules/**", "docs/dist/**"],
        include: [
          `${process.cwd()}/${config.dir || "docs/"}src/**`,
          `${process.cwd()}/src/**`,
        ],
        chokidar: {
          atomic: true,
          alwaysStat: true,
        },
      },
    };

    this.log("▶ Starting Sveature in development mode");

    let restartTimeout: any = null;
    let bundling: boolean = false;
    chokidar
      .watch([
        `${process.cwd()}/${config.dir || "docs/"}src/**`,
        `${process.cwd()}/src/**`,
      ])
      .on("all", (event: any, path: string) => {
        if (event === "add") {
          if (restartTimeout) {
            clearTimeout(restartTimeout);
          }
          restartTimeout = setTimeout(() => {
            start();
          }, 500);
        }
      });

    let watcher: any = false;

    const eventHandler = (event: any) => {
      if (event.code === "BUNDLE_START") {
        bundling = true;
        this.log(chalk.cyan("⌚ Bundling"));
      } else if (event.code === "BUNDLE_END") {
        bundling = false;
        this.log(chalk.green("✔ Bundled"));
      } else if (event.code === "ERROR") {
        bundling = false;
        this.log(chalk.red("❌ Failed"));
        if (
          event.error.message.indexOf("Could not resolve entry module") === 0
        ) {
          this.log(
            chalk.red(
              "❌ The entry module provided to rollup does not exist. Did you run 'sveature init'?"
            )
          );
          process.exit();
        } else {
          this.log(chalk.red("❌ ERROR:"));
          this.log(event.error);
        }
      }
    };

    const start = () => {
      // Wait for bundle to complete
      if (bundling) {
        restartTimeout = setTimeout(() => {
          start();
        }, 250);
        return;
      }

      if (watcher) {
        watcher.close();
      }
      watcher = rollup.watch(watcherConfig);
      watcher.on("event", eventHandler);
    };
  }
}
