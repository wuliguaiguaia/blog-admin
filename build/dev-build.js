/* 
  webpack.dev.config.js 变化自动启动重新编译
  用于调试 webpack 配置
*/

const vm = require('vm')
const { resolve } = require('path')
const { watch, readFileSync } = require('fs');
const webpack = require('webpack')
const webpackDevServer = require("webpack-dev-server");
const configPath = resolve(__dirname, './webpack.dev.config.js')

let server = null;

const runServer = async () => {
  const config = readConfig()
  const compiler = webpack(config);
  const devServerOptions = { ...config.devServer, open: false };
  server = new webpackDevServer(devServerOptions, compiler);
  console.log('Starting server...');
  await server.start()
}

const readConfig = () => {
  const content = readFileSync(configPath, 'utf-8')
  const module = { exports: {} }
  const wrapper = ['(function(require, module, exports, __dirname){', '\n})'];
  const wrapperContent = wrapper[0] + content + wrapper[1];
  const result = vm.runInThisContext(wrapperContent, {
    filename: 'dev.config.js',
  });
  result(require, module, module.exports, __dirname)
  return module.exports
}

const stopServer = async () => {
  console.log('Stopping server...');
  await server.stop();
};

let startTimer = null
runServer()

watch(configPath, {
  recursive: true
}, (eventType, filename) => {
  if (eventType === 'change') {
    stopServer()
    if (startTimer) clearTimeout(startTimer) // 防抖 3s后
    startTimer = setTimeout(() => {
      runServer()
    }, 3000);
  }
})
