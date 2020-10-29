import { Command } from "@oclif/command";
import cli from "cli-ux";
import * as chalk from "chalk";

export default class Component extends Command {
  static description = "create a new component & related files";

  static examples = [
    `$ sveature component
    creating new component
    `,
  ];

  async run() {
    const fs = require("fs-extra");
    const path = require("path");
    const { args } = this.parse(Component);
    const name =
      args.name ||
      (await cli.prompt("What do you want to call this component?"));

    const componentDir = path.resolve(process.cwd(), `src/components/${name}`);

    if (fs.existsSync(componentDir)) {
      this.error(chalk.red("❌ Component already exists!"));
    }

    this.log(`Creating component at ${componentDir}`);
    [
      "Component.svelte",
      "Component.test.ts",
      "features/Default.svelte",
    ].forEach((filename) => {
      const source = fs
        .readFileSync(
          path.resolve(__dirname, "../scaffold/component", filename)
        )
        .toString()
        .replace(/Component/g, name)
        .replace("// @ts-nocheck\n", "");
      fs.mkdirpSync(path.join(componentDir, "features"));
      fs.writeFileSync(
        path.join(componentDir, filename.replace("Component", name)),
        source
      );
    });
    this.log(chalk.green("✔ Component created"));

    this.exit(0);
  }
}
