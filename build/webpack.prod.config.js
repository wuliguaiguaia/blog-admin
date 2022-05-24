const { merge } = require('webpack-merge')
const { prod } = require('./config')
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
  optimization: {
    // deterministic 选项有益于长期缓存
    moduleIds: 'deterministic', // 固定
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          priority: 10,
          minSize: 0, /* 如果不写 0，由于 React 文件尺寸太小，会直接跳过 */
          test: /[\\/]node_modules[\\/]/, // 为了匹配 /node_modules/ 或 \node_modules\
          name: 'vendors', // 文件名
          chunks: 'all',  // all 表示同步加载和异步加载，async 表示异步加载，initial 表示同步加载
          // 这三行的整体意思就是把两种加载方式的来自 node_modules 目录的文件打包为 vendors.xxx.js
          // 其中 vendors 是第三方的意思
        },
        common: {
          priority: 5,
          minSize: 0,
          minChunks: 2, //同一个文件至少被多少个入口引用了
          chunks: 'all',
          name: 'common'
        }
      },
    },
  },
  plugins: [
    // new MiniCssExtractPlugin(/* {
    //   // 注意这里使用的是contenthash，否则任意的js改动，打包时都会导致css的文件名也跟着变动。
    //   // filename: utils.assetsPath('css/[name]_[contenthash].css')
    // } */),
    reportMemory && new BundleAnalyzerPlugin({ analyzerPort: 8887 }),
    // prod.gzip && new CompressionPlugin({ })
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: true,
      chunks: ['vendors', 'common', 'main']
    }),
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
