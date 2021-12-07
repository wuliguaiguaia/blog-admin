const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const resolve = (_path) => path.resolve(__dirname, '..', _path)

const mode = process.env.NODE_ENV

const cssLoaders = (...loaders) => [
  // Creates `style` nodes from JS strings
  mode === 'production' ? MiniCssExtractPlugin.loader : "style-loader",
  // Translates CSS into CommonJS
  {
    loader: 'css-loader',
    options: {
      modules: {
        // compileType: 'icss',
      },
    },
  },
  ...loaders
]

module.exports = {
  mode,
  context: path.resolve(__dirname, '../'),
  entry: './src/index.tsx',
  output: {
    filename: '[name].[contenthash].js',
    path: resolve('dist')
  },
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
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-react',
                {
                  runtime: 'classic'  //使用经典版
                }
              ],
              ['@babel/preset-typescript']
            ]
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: cssLoaders({
          loader: "sass-loader",
          options: {
            additionalData: `
              @import '@/styles/var.scss';
              `,
            sassOptions: {
              includePaths: [__dirname]  //基于当前目录
            },
          },
        })
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.tsx', '.json'],
    alias: {
      '@': resolve('./src/')
    }
  },
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
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx'] //不加就不会去检测.jsx文件了
    }),
    mode === 'production' && new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      template: resolve('public/index.html'),
      filename: 'index.html',
      chunks: ['vendors', 'main']
    }),
  ].filter(Boolean),
}
