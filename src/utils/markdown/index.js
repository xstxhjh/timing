const requireAll = context => context.keys()

const files = require.context('@/pages', false, /\.md$/)

const mdArr = requireAll(files)

let mdRouteArr = []

mdArr.map(item => {
    let fileName = item.split('/')[1]
    let pathName = item.split(/\/(\S*)\./)[1]
    mdRouteArr.push({
        name: pathName,
        path: pathName,
        component: () => import(`@/pages/${fileName}`)
    })
})

export default { mdRouteArr }