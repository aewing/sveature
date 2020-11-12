function getTargetFromPage(page) {
  return (
    page.params.slug ||
    (page.params["...slug"] ? page.params["...slug"].split("/") : [])
  );
}
exports.getTargetFromPage = getTargetFromPage;

function parseFeatures(features) {
  return Promise.all(features).then((fa) => {
    return fa.reduce((components, f) => {
      if (f.metadata && f.metadata.component && f.metadata.feature) {
        if (!components[f.metadata.component]) {
          components[f.metadata.component] = {};
        }
        components[f.metadata.component][f.metadata.feature] = f.default;
      }
      return components;
    }, {});
  });
}
exports.parseFeatures = parseFeatures;
