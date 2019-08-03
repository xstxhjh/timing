const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV) // 环境变量

module.exports = {
  configureWebpack: config => {
    config.externals = {
      // cdn 加速
      vue: 'Vue',
      vuex: 'Vuex',
      axios: 'axios',
      'vue-router': 'VueRouter'
    }
  },
  
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src')) // 自定义目录别名

    config.module // 引用 pug
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-plain-loader')
      .loader('pug-plain-loader')
      .end()

    const cdn = {
      css: [''],
      js: [
        '//cdn.bootcss.com/vue/2.6.10/vue.min.js',
        '//cdn.bootcss.com/vue-router/3.0.7/vue-router.min.js',
        '//cdn.bootcss.com/vuex/3.1.1/vuex.min.js',
        '//cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js'
      ]
    }
    // html中添加cdn
    config.plugin('html').tap(args => {
      args[0].cdn = cdn
      return args
    })
  },
  css: {
    modules: false,
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      sass: {
        // 向全局sass样式传入共享的全局变量
        data: `@import "@/assets/_variable.scss";`
      }
    }
  }
}
