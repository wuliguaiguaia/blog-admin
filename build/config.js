const config = {
  dev: {
    assetsPath: 'static',
    devtool: 'cheap-module-source-map'
  },
  prod: {
    assetsPath: 'static',
    gzip: true,
    devtool: 'source-map',
    publicPath: 'https://admin.orangesolo.cn'
  }
}

module.exports = config