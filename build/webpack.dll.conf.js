const path = require("path");
const webpack = require("webpack");
const { dllNames, dllPath } = require('./config')

module.exports = {
  mode: 'production',
  entry: {
    vendor: dllNames
  },
  output: {
    path: path.join(process.cwd(), "public", dllPath),
    filename: "[name].dll.js",
    library: "[name]_library" // 和 DllPlugin的name保持一致
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(process.cwd(), "public", dllPath, "[name]-manifest.json"),
      name: "[name]_library",
      context: __dirname // 必填
    })
  ]
};