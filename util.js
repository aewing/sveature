function getTargetFromPage(page) {
  return (
    page.params.slug ||
    (page.params["...slug"] ? page.params["...slug"].split("/") : [])
  );
}
exports.getTargetFromPage = getTargetFromPage;
