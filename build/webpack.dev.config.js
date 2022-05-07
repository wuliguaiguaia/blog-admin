const { merge } = require('webpack-merge')
const ESLintPlugin = require('eslint-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { dev } = require('./config')
// const utils = require('./utils')
const path = require('path')
// const resolve = (_path) => path.resolve(__dirname, '..', _path)

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: '[name].js',
    publicPath: '/'
  },
  devtool: dev.devtool,
  devServer: {
    historyApiFallback: true,/* 当使用HTML5的History API时，index.html页面可能会被用来代替任何404响应 */
    hot: true,
    compress: true,
    host: 'localhost',
    port: 8887,
    open: true,
    client: {
      logging: 'info',
      overlay: false,
    },
    proxy: {
      '/api': 'http://localhost:3009',
      '/webhook':  'http://localhost:9999',
    },
    // overlay: { warnings: false, errors: true },
    // publicPath: '/',
    // proxy: config.dev.proxyTable,
    // disableHostCheck: true,
    // quiet: true, // necessary for FriendlyErrorsPlugin
    // watchOptions: {
    //   aggregateTimeout: 200,
    //   // poll: false,
    //   // ignored: /node_modules/,
    // },
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      failOnError: false,
      fix: true
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: true,
      chunks: ['vendors', 'main']
    }),
  ].filter(Boolean)
})