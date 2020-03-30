const fs = require('fs')
const path = require('path')
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV) // 环境变量
function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

// 排序
let compare = function(property) {
  return function(a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value2 - value1
  }
}

// 读取 md 文件内容
let mdArr = [],
  str = ''
let dirSync = fs.readdirSync(resolve('src/pages'), 'utf-8')
dirSync.map(item => {
  if (item.match(/\.(\S*)/)[1] != 'md') return
  let fileSync = fs.readFileSync(resolve(`src/pages/${item}`), 'utf-8')
  let str = fileSync.split('---')[0].replace(/\s*/g, '')
  let timeDate = str.match(/\[date\]:#\((.*?)\)/)[1].replace(/-|&nbsp;|:/g, '')
  mdArr.push({
    fileName: item,
    routeName: item.match(/(\S*)\./)[1],
    fileContent: str,
    timeDate: timeDate,
    wordCount: str.length
  })
})
mdArr.sort(compare('timeDate'))
process.env.VUE_APP_MD_FILES = JSON.stringify(mdArr)

// markdown-it plugin
var markdown = require('markdown-it')({
  html: true,
  breaks: true,
  typographer: true,
  linkify: true
})

// 移除 console 和注释
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: config => {
    config.externals = {
      // cdn 加速
      vue: 'Vue',
      vuex: 'Vuex',
      axios: 'axios',
      pace: 'pace',
      'vue-router': 'VueRouter'
    }
    if (IS_PROD) {
      const plugins = []
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            comments: false, // 移除注释
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除 console
            }
          },
          sourceMap: true,
          parallel: true
        })
      )
      config.plugins = [...config.plugins, ...plugins]
    }
  },

  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src')) // 自定义目录别名

    config.optimization.minimize(true) // 压缩代码
    config.optimization.splitChunks({
      // 分割代码
      chunks: 'all'
    })

    // 引用 pug
    config.module
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-plain-loader')
      .loader('pug-plain-loader')
      .end()

    // markdown
    config.module
      .rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({ raw: true, ...markdown })

    // svg
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/svg'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/svg'))
      .end()
      .use('svg-sprite-loader') // 可以将多个svg打包成svg-spite
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },

  css: {
    loaderOptions: {
      sass: {
        // 向全局sass样式传入共享的全局变量
        data: `@import "@/assets/variable.scss";
               @import "@/assets/global.scss";`
      }
    }
  }
}
