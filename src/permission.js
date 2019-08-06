import router from './router'
// import store from './store'

router.beforeEach((to, from, next) => {
    Pace.start()
    next()
})
router.afterEach(() => {
    Pace.stop()
})