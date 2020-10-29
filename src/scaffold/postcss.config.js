module.exports = {
  plugins: [
    require("postcss-font-magician")(),
    require("postcss-preset-env")({ stage: 0 }),
  ],
};

