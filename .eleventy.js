module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/img/");

  eleventyConfig.addPassthroughCopy("src/css/");
  eleventyConfig.addWatchTarget("src/css/");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  //https://dev.to/22mahmoud/how-to-optimize-and-lazyload-images-on-eleventy-11ty-206h
  //https://obsolete29.com/posts/configuring-responsive-images-eleventy/
  const Image = require("@11ty/eleventy-img");
  eleventyConfig.addNunjucksAsyncShortcode("Image", async (src, alt) => {
    if (!alt) {
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }

    let stats = await Image(src, {
      widths: [350, 808],
      formats: ["jpeg", "webp"],
      urlPath: "/img/",
      outputDir: "./public/img/",
    });

    let lowestSrc = stats["jpeg"][0];
    let highResJpeg = stats["jpeg"][1];
    let lowReswebp = stats["webp"][0];
    let highReswebp = stats["webp"][1];

    const srcset = Object.keys(stats).reduce(
      (acc, format) => ({
        ...acc,
        [format]: stats[format].reduce(
          (_acc, curr) => `${_acc} ${curr.srcset} ,`,
          ""
        ),
      }),
      {}
    );

    const source = `<source type="image/webp" media="(max-width: 629px)" srcset="${lowReswebp.url}" >
    <source type="image/webp" media="(min-width: 630px)" srcset="${highReswebp.url}" >
    <source type="image/jpeg" media="(max-width: 529px)" srcset="${lowestSrc.url}" >
    <source type="image/jpeg" media="(min-width: 630px)" srcset="${highResJpeg.url}" >`;

    const img = `<img
                loading="lazy"
                alt="${alt}"
                width="${highResJpeg.width}"
                height="${highResJpeg.height}"
                src="${lowestSrc.url}">`;

    return `<picture>${source}${img}</picture>`;
  });

  return {
    dir: {
      input: "src",
      output: "public",
    }
  };
};
