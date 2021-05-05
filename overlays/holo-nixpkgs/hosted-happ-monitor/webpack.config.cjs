const path = require("path");
const webpack = require("webpack");

module.exports = {
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),

  },
  entry: ["./src/index.js"],
  module: {
    rules: [
      { test: /\.js$/, include: /node_modules/, type: "javascript/auto" },
    ],
  },
  target: 'node',
  mode: "development",
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
  ],
};
