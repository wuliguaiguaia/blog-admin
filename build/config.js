const config = {
  dev: {
    assetsPath: 'static',
    devtool: 'cheap-module-source-map',
    publicPath: '/',
  },
  prod: {
    assetsPath: 'static',
    gzip: true,
    devtool: 'source-map',
    publicPath: 'https://admin.orangesolo.cn/',
  },
  dllPath: 'static/dll/',
  bundleReport: true,
}

module.exports = config