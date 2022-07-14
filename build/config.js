const config = {
  dev: {
    assetsPath: 'static',
    devtool: 'eval-cheap-module-source-map',
    publicPath: '/',
  },
  prod: {
    assetsPath: 'static',
    gzip: true,
    devtool: 'cheap-module-source-map',
    publicPath: 'https://admin.orangesolo.cn/',
  },
  dllPath: 'static/dll/',
  bundleReport: false,
}

module.exports = config