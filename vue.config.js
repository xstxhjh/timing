const path = require('path')

function resolve (dir) {
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
            css: [
                '//cdn.bootcss.com/pace/1.0.2/themes/pink/pace-theme-flash.css',
                '//cdn.bootcss.com/highlight.js/9.6.0/styles/monokai_sublime.min.css'
            ],
            js: [
                '//cdn.bootcss.com/vue/2.6.10/vue.min.js',
                '//cdn.bootcss.com/vue-router/3.0.7/vue-router.min.js',
                '//cdn.bootcss.com/vuex/3.1.1/vuex.min.js',
                '//cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js',
                '//cdn.bootcss.com/pace/1.0.2/pace.min.js',
                '//cdn.bootcss.com/highlight.js/9.15.9/highlight.min.js'
            ]
        }
        // html中添加cdn
        config.plugin('html').tap(args => {
            args[0].cdn = cdn
            return args
        })

        // markdown
        config.module.rule('md')
            .test(/\.md/)
            .use('vue-loader')
            .loader('vue-loader')
            .end()
            .use('vue-markdown-loader')
            .loader('vue-markdown-loader/lib/markdown-compiler')
            .options({
                raw: true
            })

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
        modules: false,
        extract: IS_PROD,
        sourceMap: false,
        loaderOptions: {
            sass: {
                // 向全局sass样式传入共享的全局变量
                data: `@import "@/assets/variable.scss";`
            }
        }
    }
}
