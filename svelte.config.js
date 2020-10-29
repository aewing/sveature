module.exports = {
  preprocess: [
    require("svelte-preprocess")({
      postcss: require("./postcss.config"),
    }),
  ],
};
