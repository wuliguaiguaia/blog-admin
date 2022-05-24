const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const resolve = (_path) => path.resolve(__dirname, '..', _path)
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { dev, prod, dllPath } = require('./config')
const manifestCommon = require("../public/static/dll/vendor-manifest.json");
console.log(path.join(process.cwd(), 'public', dllPath, 'vendor-manifest.json'));
const env = process.env.NODE_ENV === 'development' ? dev : prod

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /(node_modules)/,
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
            ],
            plugins: [
              ['import', {
                libraryName: 'antd',
                libraryDirectory: 'es',	// 这条加了可以再少20k左右
                style: 'css',	// 也可以配置为'css'。配置true可以减少30k
              }]
            ]
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: utils.cssLoaders({
          loader: "sass-loader",
          options: {
            additionalData: `
              @import '@/assets/styles/var.scss';
              `,
            sassOptions: {
              includePaths: [__dirname]  //基于当前目录
            },
          },
        })
      },
      /* {
        test: /\.less$/i,
        use: utils.cssLoaders({
          loader: "less-loader",
        })
      }, */
      //针对antd不启用模块化css
      {
        test: /\.css$/,
        include: /node_modules|antd\.css/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          }
        ]
      },
      {
        test: /\.(svg|png|jpe?g|gif)(\?.*)?$/i,
        // file-loader 可以把 JavaScript 和 CSS 中导入图片的语句替换成正确的地址，并同时把文件输出到对应的位置。
        // 如 http://0.0.0.0:8080/03e537ab27f16fc30391ca0aef6c04d7.svg
        // url- loader 可以把文件的内容经过 base64 编码后注入到 JavaScript 或者 CSS 中去。
        // 一般利用 url-loader 把网页需要用到的小图片资源注入到代码中去，以减少加载次数
        use: [{
          loader: 'url-loader',
          options: {
            // 30KB 以下的文件采用 url-loader
            limit: 1024 * 30,
            // 否则采用 file-loader，默认值就是 file-loader 
            fallback: 'file-loader',
            name: utils.assetsPath('imgs/[name].[hash:7].[ext]'),
            exclude: resolve('node_modules'),
            esModule: false
          },
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
        },
        exclude: resolve('node_modules')
      },
      {
        test: /\.(woff2?|eot|ttf|otf|ttc)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    alias: {
      '@': resolve('src')
    },
    fallback: { crypto: false }
  },
  optimization: {
    // deterministic 选项有益于长期缓存
    moduleIds: 'deterministic', // 固定
    // runtimeChunk: {
    //   name: 'runtime'
    // },
    // splitChunks: {
    //   cacheGroups: {
    //     // vendor: {
    //     //   priority: 10,
    //     //   minSize: 0, /* 如果不写 0，由于 React 文件尺寸太小，会直接跳过 */
    //     //   test: new RegExp(),   // 为了匹配 /node_modules/ 或 \node_modules\
    //     //   name: 'vendors', // 文件名
    //     //   chunks: 'all',  // all 表示同步加载和异步加载，async 表示异步加载，initial 表示同步加载
    //     //   // 这三行的整体意思就是把两种加载方式的来自 node_modules 目录的文件打包为 vendors.xxx.js
    //     //   // 其中 vendors 是第三方的意思
    //     // },
    //     common: {
    //       priority: 5,
    //       minSize: 0,
    //       minChunks: 2, //同一个文件至少被多少个入口引用了
    //       chunks: 'all',
    //       name: 'common'
    //     }
    //   },
    // },
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          WEBHOOK_SECRET: JSON.stringify(process.env.WEBHOOK_SECRET)
        }
      },
    }),
    new webpack.DllReferencePlugin({ // 动态链接
      manifest: path.join(process.cwd(), 'public', dllPath, 'vendor-manifest.json')
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: true,
      chunks: ['vendors', 'common', 'main'],
      dllPath: path.join(env.publicPath, dllPath)
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(process.cwd(), "public", dllPath),
          to: path.resolve('dist', dllPath),
        }]
    }),

  ].filter(Boolean),
}
