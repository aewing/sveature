const path = require("path");
const fs = require("fs");
const resolve = require("@rollup/plugin-node-resolve").default;
const replace = require("@rollup/plugin-replace");
const commonjs = require("@rollup/plugin-commonjs");
const svelte = require("rollup-plugin-svelte");
const { terser } = require("rollup-plugin-terser");
const livereload = require("rollup-plugin-livereload");
const postcss = require("rollup-plugin-postcss");
const serve = require("rollup-plugin-serve");
const globFiles = require("rollup-plugin-glob-files").default;

const mode = process.env.NODE_ENV || "development";
const dev = mode === "development";

const onwarn = (warning, onwarn) =>
  (warning.code === "MISSING_EXPORT" && /'preload'/.test(warning.message)) ||
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  warning.code === "THIS_IS_UNDEFINED" ||
  onwarn(warning);

function configOr(name, fallback = {}) {
  const filename = path.resolve(process.cwd(), name);
  return fs.existsSync(filename) ? require(filename) : fallback;
}

function generateRollupConfig(options = {}) {
  let svelteConfig = {}, postcssConfig = {};

  try {
    svelteConfig = require(path.join(process.cwd(), "svelte.config"));
  } catch(e) {}

  try {
    postcssConfig = require(path.join(process.cwd(), "postcss.config"));
  } catch(e) {}

  return {
    input: options.input || path.resolve(process.cwd(), "docs/src/main.ts"),
    output: options.output || {
      file: path.resolve(process.cwd(), "docs/dist/main.js"),
    },
    inlineDynamicImports: true,
    plugins: [
      replace(
        options.replace || {
          "process.browser": "true",
          "process.env.NODE_ENV": JSON.stringify(mode),
        }
      ),
      globFiles({
        key: "@features",
        importStar: true,
        include:
          options.pattern ||
          path.join(process.cwd(), "src/**/features/*.svelte"),
        exclude: ["node_modules/"],
      }),
      dev && livereload(),
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
        ...svelteConfig,
      }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      postcss(postcssConfig),
      dev &&
        serve({
          contentBase: path.join(process.cwd(), "docs/dist"),
          historyApiFallback: "/index.html",
        }),
      !dev &&
        terser({
          module: true,
        }),
    ],
    preserveEntrySignatures: false,
    onwarn,
  };
}

module.exports = generateRollupConfig;
