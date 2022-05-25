const config = {
  dev: {
    assetsPath: 'static',
    devtool: 'cheap-module-source-map',
    publicPath: './',
  },
  prod: {
    assetsPath: 'static',
    gzip: true,
    devtool: 'source-map',
    publicPath: 'https://admin.orangesolo.cn'
  },
  bundleReport: true,
  dllPath: 'static/dll/',
  dllNames: [
    "react",
    "react-dom",
    "react-router-dom",
    "react-redux",
    "redux",
    "redux-thunk",
    "axios",
    "classnames",
    "lodash",
    "highlight.js",
  ]
}

module.exports = config