import { Command } from "@oclif/command";

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
    this.log("building feature library");
    const bundle = await rollup.rollup(config);
    await bundle.write(config.output);
    this.log("built successfully");
    this.exit(0);
  }
}
