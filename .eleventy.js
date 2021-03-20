module.exports = function (eleventyConfig) {
  const pageAssetsPlugin = require('eleventy-plugin-page-assets');
  eleventyConfig.addPlugin(pageAssetsPlugin, {
    mode: "parse",
    postsMatching: "src/pages/**/*.md",
  });

  eleventyConfig.addPassthroughCopy("src/css/");
  eleventyConfig.addWatchTarget("src/css/");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      output: "public",
    }
  };
};
