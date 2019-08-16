import router from './router'
// import store from './store'

router.beforeEach((to, from, next) => {
    Pace.start()
    TweenMax.to(window, 0, { scrollTo: 0 })
    next()
})
router.afterEach(() => {
    Pace.stop()
})