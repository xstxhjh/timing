
const fs = require('fs')
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

function beforeFn() {
    // 排序
    let compare = function (property) {
        return function (a, b) {
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

}

exports.beforeGetMD = beforeFn
