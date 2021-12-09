const { merge } = require('webpack-merge')
const ESLintPlugin = require('eslint-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config')
const { dev } = require('./config')
// const utils = require('./utils')
const path = require('path')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: '[name].js',
  },
  devtool: dev.devtool,
  devServer: {
    // inline: true,
    // clientLogLevel: 'warning',
    // historyApiFallback: {
    //   rewrites: [
    //     {
    //       from: /.*/,
    //       to: path.posix.join('public', 'index.html')
    //     }
    //   ]
    // },
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
    progress: true,
    hot: true,
    // contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: '0.0.0.0',
    port: 8080,
    open: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     pathRewrite: { '^/api': '' },
    //   },
    // overlay: { warnings: false, errors: true },
    // publicPath: '/',
    // // proxy: config.dev.proxyTable,
    // // disableHostCheck: true,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      aggregateTimeout: 200,
      poll: false,
      ignored: /node_modules/,
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
  ].filter(Boolean)
})