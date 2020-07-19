var nestedAccordion = require("nested-accordion");
var authenticLearningDataFile = require("./data.json");

module.exports = function(eleventyConfig) {
  eleventyConfig.addShortcode("authentic_learning_accordion", () => {
    var data = JSON.parse(authenticLearningDataFile.data);
    data.forEach(location => delete location.text); // remove gps coordinates
    return nestedAccordion.create(data);
  });

  const createGeoFeature = location => ({
    type: "Feature",
    properties: {
      name: location.title,
      html: `<h6>${location.title}</h6>
      ${nestedAccordion.create(location.children)}`,
      size: [].concat(...location.children).length + 2
    },
    geometry: {
      type: "Point",
      coordinates: location.text
        .split(",")
        .map(parseFloat)
        .sort()
    }
  });

  eleventyConfig.addShortcode("authentic_learning_geojson", () => {
    const geojson = {
      type: "FeatureCollection",
      features: JSON.parse(authenticLearningDataFile.data).map(createGeoFeature)
    };

    return JSON.stringify(geojson);
  });

  eleventyConfig.addShortcode("accordion_styles", () =>
    nestedAccordion.styles()
  );

  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("data.json");
  eleventyConfig.addPassthroughCopy("favicon.ico");
};
