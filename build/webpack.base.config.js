const path = require('path')
const utils = require('./utils')

const resolve = (_path) => path.resolve(__dirname, '..', _path)

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
      {
        test: /\.less$/i,
        use: utils.cssLoaders({
          loader: "less-loader",
        })
      },
      // //针对antd不启用模块化css
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
      '@': resolve('./src/')
    }
  },
  plugins: [].filter(Boolean),
}
