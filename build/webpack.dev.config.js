const { merge } = require('webpack-merge')
const ESLintPlugin = require('eslint-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
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
      "/api": {
        target: 'https://mini-orange.cn',
        changeOrigin: true, // changeOrigin默认是false：请求头中host仍然是浏览器发送过来的host
      },
      "/webhook": {
        target: 'https://mini-orange.cn',
        changeOrigin: true,
      },
      // '/api': 'http://localhost:3009',
      // '/webhook':  'http://localhost:9999',
    },
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      failOnError: false,
      fix: true
    }),
  ].filter(Boolean)
})