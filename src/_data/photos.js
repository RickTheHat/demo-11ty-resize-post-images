const Cache = require("@11ty/eleventy-cache-assets");

module.exports = async function () {
    let json = await Cache("https://jsonplaceholder.typicode.com/photos", {
        duration: "1d",
        type: "json"
    });

    return json;
}