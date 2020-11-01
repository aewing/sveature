const path = require("path");
const resolve = require("@rollup/plugin-node-resolve").default;
const replace = require("@rollup/plugin-replace");
const commonjs = require("@rollup/plugin-commonjs");
const svelte = require("rollup-plugin-svelte");
const { terser } = require("rollup-plugin-terser");
const livereload = require("rollup-plugin-livereload");
const postcss = require("rollup-plugin-postcss");
const serve = require("rollup-plugin-serve");
const globFiles = require("rollup-plugin-glob-files").default;

const onwarn = (warning, onwarn) =>
  (warning.code === "MISSING_EXPORT" && /'preload'/.test(warning.message)) ||
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  warning.code === "THIS_IS_UNDEFINED" ||
  onwarn(warning);

function generateRollupConfig(options = {}) {
  const dev = !!options.dev;
  let svelteConfig = {},
    postcssConfig = {};

  try {
    svelteConfig = require(path.join(process.cwd(), "svelte.config"));
  } catch (e) {}

  try {
    postcssConfig = require(path.join(process.cwd(), "postcss.config"));
  } catch (e) {}

  const distDir = path.resolve(process.cwd(), options.dir || "docs/", "dist");

  const config = {
    input: options.input || path.resolve(process.cwd(), "docs/src/main.ts"),
    output: options.output || {
      file: path.resolve(process.cwd(), "docs/dist/main.js"),
    },
    inlineDynamicImports: true,
    plugins: [
      replace({
        "process.browser": "true",
        "process.env.NODE_ENV": JSON.stringify(
          dev ? "development" : "production"
        ),
        ...(options.replace || {}),
      }),
      globFiles({
        key: "@features",
        importStar: true,
        include:
          options.pattern ||
          path.join(process.cwd(), "src/**/features/*.svelte"),
        exclude: ["node_modules/"],
        ...(options.globConfig || {}),
      }),
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
        ...svelteConfig,
      }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
        ...(options.resolve || {}),
      }),
      commonjs(),
      postcss(postcssConfig),
      (options.dev || options.serve) &&
        serve({
          contentBase: distDir,
          historyApiFallback: "/index.html",
          ...(options.serve || {}),
        }),
    ],
    preserveEntrySignatures: false,
    onwarn,
    ...(options.rollup || {}),
  };

  if (dev) {
    config.watch = {
      exclude: ["node_modules/**", `${distDir}/**`],
      include: [
        `${process.cwd()}/${config.dir || "docs/"}src/**`,
        `${process.cwd()}/src/**`,
        `${path.resolve(__dirname, "Layout.svelte")}`,
      ],
      ...(options.watch || {}),
    };
    config.plugins.push(
      livereload({
        port: options.port || 10001,
        ...(options.liveReload || {}),
      })
    );
  } else {
    config.plugins.push(
      terser({
        module: true,
      })
    );
  }

  return config;
}

module.exports = generateRollupConfig;
