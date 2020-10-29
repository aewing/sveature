const eslintSveltePreprocess = require("eslint-svelte3-preprocess");
const svelteConfig = require("./svelte.config");

module.exports = {
  extends: ["oclif", "oclif-typescript", "prettier"],
  plugins: ["svelte3"],
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
      rules: {
        "import/first": 0,
        "import/no-duplicates": 0,
        "import/no-mutable-exports": 0,
        "import/no-unresolved": 0,
      },
    },
  ],
  settings: {
    "svelte3/preprocess": eslintSveltePreprocess(svelteConfig.preprocess),
    "svelte3/ignore-styles": () => true,
  },
};
