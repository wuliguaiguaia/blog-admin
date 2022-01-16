const path = require('path')
const config = require('./config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/* 静态资源生成路径 */
const assetsPath = (_path) => {
  const assetsPath = process.env.NODE_ENV === 'production'
    ? config.dev.assetsPath
    : config.prod.assetsPath
  return path.posix.join(assetsPath, _path)
}

/* css loader 集成 */
const cssLoaders = (...loaders) => [
  // Creates `style` nodes from JS strings
  process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : "style-loader",
  // Translates CSS into CommonJS
  {
    loader: 'css-loader',
    options: {
      modules: true /* css-module */
    },
  },
  ...loaders
]

module.exports = {
  assetsPath,
  cssLoaders
}