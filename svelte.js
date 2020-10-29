/* eslint-disable node/no-missing-require */
function getComponentFeatures() {
  const features = require("@features").default;
  const components = {};
  features.forEach((m) => {
    const { component, feature, title } = m.metadata;
    if (!components[component]) {
      components[component] = {};
    }
    components[component][feature] = { title, Component: m.default };
  });
  return components;
}
module.exports.getComponentFeatures = getComponentFeatures;
