const { merge } = require('webpack-merge')
const { prod, dllPath } = require('./config')
const path = require('path')
// const webpack = require('webpack')
const utils = require('./utils')
const CompressionPlugin = require('compression-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
  optimization: {
    // deterministic 选项有益于长期缓存
    moduleIds: 'deterministic', // 固定
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      cacheGroups: {
        // vendorReact: {
        //   priority: -10,
        //   test: /node_modules\/(react|react-dom|redux|react-redux|react-thunk|react-router-dom)/,
        //   name: 'vendorReact', // 文件名
        //   chunks: 'all', // all 表示同步加载和异步加载，async 表示异步加载，initial 表示同步加载
        // },
        vendorEditor: {
          priority: -10,
          test: /node_modules[/\\](highlight\.js|marked)/,
          name: 'vendorEditor',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.html$|\.css$|\.svg$/,
      threshold: 10240,  // 文件压缩阈值，对超过10k的进行压缩
      deleteOriginalAssets: false,
      minRatio: 0.8
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(process.cwd(), "public", dllPath),
          to: path.resolve('dist', dllPath),
        }]
    }),
    
  ].filter(Boolean)
})

// MiniCssExtractPlugin 遇 smp 报错！
webpackConfig.plugins.push(new MiniCssExtractPlugin({
  filename: utils.assetsPath('css/[name]_[contenthash].css')
}))

module.exports = webpackConfig
