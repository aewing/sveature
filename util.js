function getTargetFromPage(page) {
  const [component, feature] = (
    page.params.slug ||
    (page.params["...slug"] ? page.params["...slug"].split("/") : [])
  );
  return [component, feature];
}
exports.getTargetFromPage = getTargetFromPage;
