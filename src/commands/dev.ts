/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
import { Command } from "@oclif/command";

export default class Hello extends Command {
  static description = "start feature library in development mode";

  static examples = [
    `$ sveature dev
    starting sveature
    `,
  ];

  async run() {
    const fs = require("fs");
    const path = require("path");
    const rollup = require("rollup");

    const configPath = path.join(process.cwd(), "sveature.config.js");
    const config: any = {};
    if (fs.existsSync(configPath)) {
      Object.assign(config, require(configPath));
    }
    const rollupConfig = require("../../rollup")(config);

    this.log("starting sveature", process.cwd(), config);
    const watcher = rollup.watch({
      ...rollupConfig,
      watch: {
        exclude: ["node_modules/**", "docs/dist/**"],
        include: [
          path.join(process.cwd(), config.dir || "docs/", "src/"),
          path.join(process.cwd(), config.pattern || "src/**/features/*.svx"),
        ],
      },
    });

    const end = (code = 0) => {
      watcher.close();
      process.exit(code);
    };

    watcher.on("event", (event: any) => {
      if (event.code === "BUNDLE_START") {
        this.log("⌚ Bundle started");
      } else if (event.code === "BUNDLE_END") {
        this.log("✔ Bundle completed");
      } else if (event.code === "ERROR") {
        this.log("❌ Bundle failed");
        if (
          event.error.message.indexOf("Could not resolve entry module") === 0
        ) {
          this.log(
            "❌ The entry module provided to rollup does not exist. Did you run 'sveature init'?"
          );
          end(1);
        } else {
          this.log("❌", event.error.message);
          end(2);
        }
      }
    });
  }
}
