const path = require("path");
const webpack = require("webpack");
const { dllPath } = require('./config')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  mode: 'production',
  entry: {
    common: ['react', 'react-dom', 'react-dom/server', 'react-router-dom', 'redux', 'react-redux', 'redux-thunk', 'axios', 'classnames'],
  },
  output: {
    path: path.join(process.cwd(), "public", dllPath),
    filename: "[name].dll.js",
    library: "[name]_library"
  },
  plugins: [
    new BundleAnalyzerPlugin({ analyzerPort: 8787 }),
    new webpack.DllPlugin({
      path: path.join(process.cwd(), "public", dllPath, "[name]-manifest.json"),
      name: "[name]_library",
      context: __dirname,
      format: true
    })
  ]
};