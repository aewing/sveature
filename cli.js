#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const { debounce } = require("throttle-debounce");
const svelte = require("svelte/compiler");

const DEFAULT_PATTERN = "src/components/**/features/*.svelte";

const args = require("minimist")(process.argv.slice(2));
const [command, ...params] = args._;

let svelteConfig = {};
const svelteConfigPath = path.resolve(process.cwd(), "svelte.config.js");
if (fs.existsSync(svelteConfigPath)) {
  svelteConfig = require(svelteConfigPath);
}

const config = getConfig();
const sveatureDir = path.resolve(
  process.cwd(),
  config.dir || "src/routes/docs"
);
console.log("Sveature directory", sveatureDir);
if (!fs.existsSync(sveatureDir)) {
  fs.mkdirSync(sveatureDir);
}

switch (command) {
  case "watch":
    const featureMap = {};
    const writeFeatures = debounce(1000, () => {
      console.log("Writing features...", sveatureDir);
      const imports = [];
      Object.entries(featureMap).forEach(([component, features]) =>
        Object.entries(features).forEach(([feature, filename]) => {
          imports.push(
            `import ${component.replace(/ /g, "")}${feature.replace(
              / /g,
              ""
            )} from "${filename}";`
          );
        })
      );
      fs.writeFileSync(
        path.join(sveatureDir, config.filename || "_features.ts"),
        [
          ...imports,
          "export default {",
          Object.entries(featureMap)
            .map(
              ([component, features]) =>
                `  "${component}": {${Object.keys(features)
                  .map(
                    (feature) => `
    "${feature}": ${component.replace(/ /g, "")}${feature.replace(/ /g, "")},`
                  )
                  .join("")}\n  }`
            )
            .join(",\n"),
          "};",
        ].join("\n")
      );
    });
    watchFeatures(config.pattern, async (event, filename) => {
      try {
        let source = fs.readFileSync(filename).toString();
        if (svelteConfig.preprocess) {
          const { code } = await svelte.preprocess(
            source,
            svelteConfig.preprocess,
            {
              filename,
            }
          );
          source = code;
        }
        const compiled = svelte.compile(source, {
          filename,
          generate: false,
          css: false,
        });
        const metadata = compiled.ast.module.content.body
          .find((node) =>
            node.declarations.some((decl) => {
              return decl.id.name === "metadata";
            })
          )
          .declarations.shift()
          .init.properties.reduce(
            (obj, prop) => ({
              ...obj,
              [prop.key.name]: prop.value.value,
            }),
            {}
          );
        if (!featureMap[metadata.component]) {
          featureMap[metadata.component] = {};
        }
        featureMap[metadata.component][metadata.feature] = filename.replace(
          "src/components",
          "$components"
        );
        writeFeatures();
      } catch (err) {
        console.error(err);
      }
    });
    break;
  case "build":
    writeFeatures(config);
    break;
  default:
    console.log(`Invalid command: ${command}`);
}

function getConfig() {
  const configPath = require("path").resolve(
    process.cwd(),
    "sveature.config.js"
  );
  if (require("fs").existsSync(configPath)) {
    return require(configPath);
  }
  return {};
}

function watchFeatures(pattern = DEFAULT_PATTERN, callback) {
  console.log(`Watching feature files @ ${pattern}`);
  chokidar.watch(pattern).on("all", callback);
}
