const { merge } = require('webpack-merge')
const { prod, dllPath } = require('./config')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const path = require('path')
// const webpack = require('webpack')
const utils = require('./utils')
const CompressionPlugin = require('compression-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SpeedMeasureWebpack = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasureWebpack();

const reportMemory = process.argv[2] === '--report'

const CopyWebpackPlugin = require('copy-webpack-plugin')


let webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    publicPath: prod.publicPath, /* 静态资源域名及路径 */
  },
  module: {

  },
  devtool: prod.devtool,
  plugins: [
    // new MiniCssExtractPlugin(/* {
    //   // 注意这里使用的是contenthash，否则任意的js改动，打包时都会导致css的文件名也跟着变动。
    //   // filename: utils.assetsPath('css/[name]_[contenthash].css')
    // } */),
    reportMemory && new BundleAnalyzerPlugin({ analyzerPort: 9999 }),

    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.html$|\.css$|\.svg$/,
      threshold: 10240,  // 文件压缩阈值，对超过10k的进行压缩
      deleteOriginalAssets: false,
      minRatio: 0.8
    })
  ].filter(Boolean)
})


webpackConfig = reportMemory ? smp.wrap(webpackConfig) : webpackConfig

// MiniCssExtractPlugin 遇 smp 报错！
webpackConfig.plugins.push(new MiniCssExtractPlugin({
  filename: utils.assetsPath('css/[name]_[contenthash].css')
}))

module.exports = webpackConfig
