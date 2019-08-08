
const fs = require("fs")
const path = require('path')
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV) // 环境变量
function resolve (dir) {
    return path.join(__dirname, '.', dir)
}

// 读取 md 文件内容
let mdArr = [],
    str = '';
let dirSync = fs.readdirSync(resolve('src/pages'), "utf-8")
dirSync.map(item => {
    if (item.match(/\.(\S*)/)[1] != 'md') return
    let fileSync = fs.readFileSync(resolve(`src/pages/${item}`), "utf-8")
    let str = fileSync.split('---')[0].replace(/\s*/g, "")
    mdArr.push({
        fileName: item,
        routeName: item.match(/(\S*)\./)[1],
        fileContent: str
    })
})
process.env.VUE_APP_MD_FILES = JSON.stringify(mdArr)

// 移除 console 和注释
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    configureWebpack: config => {
        config.externals = {
            // cdn 加速
            vue: 'Vue',
            vuex: 'Vuex',
            axios: 'axios',
            pace: 'pace',
            moment: 'moment',
            'vue-router': 'VueRouter'
        }
        if (IS_PROD) {
            const plugins = []
            plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        comments: false, // 移除注释
                        compress: {
                            warnings: false,
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log'] // 移除 console
                        }
                    },
                    sourceMap: false,
                    parallel: true
                })
            )
            config.plugins = [
                ...config.plugins,
                ...plugins
            ]
        }
    },

    chainWebpack: config => {
        config.resolve.alias.set('@', resolve('src')) // 自定义目录别名

        config.optimization.minimize(true) // 压缩代码
        config.optimization.splitChunks({  // 分割代码
            chunks: 'all'
        })

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
                '//cdn.bootcss.com/highlight.js/9.15.9/highlight.min.js',
                '//cdn.bootcss.com/moment.js/2.24.0/moment.min.js'
            ]
        }
        // html中添加cdn
        config.plugin('html').tap(args => {
            args[0].cdn = cdn
            return args
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
            .options({
                raw: true
            })

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
