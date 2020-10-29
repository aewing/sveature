import { Command } from "@oclif/command";
import * as chalk from "chalk";

export default class Build extends Command {
  static description = "build feature library";

  static examples = [
    `$ sveature build
    building feature library
    `,
  ];

  async run() {
    const config = require("../../rollup")();
    const rollup = require("rollup");
    this.log(chalk.cyan("⌚ Building Sveature"));
    const bundle = await rollup.rollup(config);
    await bundle.write(config.output);
    this.log(chalk.green("✔ Build completed"));
    this.exit(0);
  }
}
