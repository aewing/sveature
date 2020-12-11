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
if (!fs.existsSync(sveatureDir)) {
  fs.mkdirSync(sveatureDir);
}

switch (command) {
  case "watch":
    const featureMap = {
      navigation: {},
      routes: {},
    };
    const writeFeatures = debounce(1000, () => {
      fs.writeFileSync(
        path.join(sveatureDir, config.filename || "_features.ts"),
        [
          `export const routes = {${Object.entries(featureMap.routes)
            .map(
              ([key, [title, filename]]) =>
                `"${key}": ["${title}", () => import("${filename}").then(m => m.default)]`
            )
            .join(", ")}};`,
          `export const navigation = ${JSON.stringify(featureMap.navigation)}`,
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
          .init.properties.reduce((obj, prop) => {
            return {
              ...obj,
              [prop.key.name]:
                prop.value.type === "ArrayExpression"
                  ? prop.value.elements.map((e) => e.value)
                  : prop.value.value,
            };
          }, {});
        if (!metadata.navigation || (!metadata.label && !metadata.title) || !metadata.slug) {
          console.warn(
            `Invalid feature metadata exported by ${filename}. Expected "navigation", "label", and "slug" properties.`
          );
          return;
        }
        const navTarget = metadata.navigation.reduce((acc, key) => {
          if (!acc[key]) {
            acc[key] = { _items: [] };
          }
          return acc[key];
        }, featureMap.navigation);
        const previous = navTarget._items.find((t) => t.slug === metadata.slug);
        if (previous) {
          previous.title = metadata.title || metadata.label;
          previous.label = metadata.label || metadata.title;
        } else {
          navTarget._items.push({
            label: metadata.label || metadata.title,
            slug: metadata.slug,
          });
        }
        featureMap.routes[metadata.slug] = [metadata.title || metadata.label, filename.replace(
          "src/components",
          "$components"
        )];
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
