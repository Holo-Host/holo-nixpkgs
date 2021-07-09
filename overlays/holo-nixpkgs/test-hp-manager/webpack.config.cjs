const path = require("path");

module.exports = {
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),

  },
  entry: {
    pingCheck: "./src/index.js",
    channelSwitch: "./src/switcher.js",
    rebooter: "./src/rebooter.js"
},
  module: {
    rules: [
      { test: /\.js$/, include: /node_modules/, type: "javascript/auto" },
    ],
  },
  target: 'node',
  mode: "development",
};
