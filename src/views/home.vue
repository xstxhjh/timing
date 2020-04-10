<template lang="pug">
.container(ref="container")
    .posts-expand(v-for="(item,index) in postAll" :key="index" :id="item.timeDate" :ref="item.timeDate")
        .post-header
            .post-header-title(@click="goToPost(item.routeName)") {{item.title}}
            .post-header-meta(v-html="`发表于 ${item.date} | 总计 ${item.wordCount} 个字`")
        .post-body
            img.post-body-image(:src="item.image")
            .post-body-content(v-html="item.description")
            .post-body-button(@click="goToPost(item.routeName)") 阅读全文 »
            
    .end-pagination(:style="$parent.navIconOpen?'':'left: 1rem;'")
        .end-pagination-title 页
        .end-pagination-item(
            :class="{'pagination-item-actived': item == pageCurrent}"
            v-for="item in Math.ceil(postLength/pageSize)"
            :key="item"
            @click="pageCurrentChange(item)") {{item}}

    .right-anchor
        .right-anchor-link(
            v-for="(item, index) in anchorActived"
            :key="index"
            :class="{'right-anchor-link-actived': (index*scrollAll <= scrollTop) && (scrollTop < (index+1)*scrollAll)}"
            )
            a(@click="anchorTo(item.timeDate)") {{item.title}}
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {
            navIconOpen: false,
            pageSize: 5,
            pageCurrent: 1,
            postLength: 0,
            anchorActived: [],
            scrollTop: 0,
            scrollAll: 0
        }
    },
    watch: {
        'postAll': {
            immediate: true,
            handler(newVal, oldVal) {
                this.$nextTick(() => {
                    let heightArr = []
                    let arr = [...newVal]
                    arr.map((item, index) => {
                        heightArr.push({
                            title: item.title,
                            timeDate: item.timeDate,
                        })
                    })
                    this.anchorActived = heightArr
                })
            }
        },
        '$parent.topValue': {
            immediate: false,
            handler(topValue, oldVal) {
                let pageSize = this.pageSize
                let anLength = this.anchorActived.length
                this.scrollTop = topValue
                this.scrollAll = 100 / anLength + 3
            }
        },
        '$route': {
            immediate: true,
            handler(newVal, oldVal) {
                this.pageCurrent = newVal.query.pageCurrent || 1
            }
        },
    },
    filters: {},
    computed: {
        postAll() {
            let arr = [...this.$store.state.markdownAll]
            let start = (this.pageCurrent - 1) * this.pageSize
            let end = this.pageCurrent * this.pageSize
            this.getPostLength(arr.length)
            return arr.slice(start, end)
        }
    },
    methods: {
        navIconChange() {
            this.navIconOpen = !this.navIconOpen
        },
        goToPost(routeName) {
            this.$router.push({
                name: routeName
            })
        },
        getPostLength(length) {
            this.postLength = length
        },
        pageCurrentChange(value) {
            if (this.pageCurrent == value) return
            this.$router.push({
                path: '/',
                query: {
                    pageCurrent: value
                }
            })
        },
        anchorTo(timeDate) {
            let ref = this.$refs[timeDate][0]
            TweenMax.to(window, 0, { scrollTo: ref.offsetTop })
        },
        getRect(ele) {
            let inHeight = window.innerHeight
            let rect = ele.getBoundingClientRect()

            rect.isVisible = rect.top - inHeight < 0  // 是否在可视区域
            rect.isBottom = rect.bottom - inHeight <= 0
            return rect
        },
    },
    mounted() {
        // function timeout(ms) {
        //     return new Promise((resolve, reject) => {
        //         setTimeout(resolve, ms, 'finish')
        //     })
        // }
        // async function asyncTimeSys() {
        //     await timeout(1000)
        //     console.log('第一层异步结束！')
        //     await timeout(1000)
        //     console.log('第二层异步结束！')
        //     await timeout(1000)
        //     console.log('第三层异步结束！')
        //     await timeout(1000)
        //     console.log('第四层异步结束！')
        //     await timeout(1000)
        //     console.log('第五层异步结束！')
        //     return 'all finish'
        // }
        // asyncTimeSys().then(value => {
        //     console.log(value)
        // })
    }
}
</script>

<style scoped lang="scss">
.container {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.posts-expand {
    width: 80%;
    padding-top: 4rem;
}

.post-header {
    color: $theme-light-color;
    .post-header-title {
        font-size: 2.8rem;
        font-weight: bold;
        line-height: 3rem;
        margin: 2rem 0 1.4rem;
        transition: 0.1s all linear;
        display: inline-block;
        position: relative;
        cursor: pointer;
    }
    .post-header-title:before {
        content: "";
        position: absolute;
        top: 0;
        left: 50%;
        width: 0;
        height: 100%;
        border-bottom: 0.2rem solid $theme-light-color;
        transition: 0.2s all linear;
    }
    .post-header-title:hover::before {
        width: 100%;
        left: 0;
        border-bottom-color: $theme-light-color;
        transition-delay: 0.1s;
        z-index: -1;
    }
    .post-header-meta {
        font-size: 1.3rem;
        color: #999;
    }
}

.post-body {
    width: 90%;
    margin: 0 auto;
    .post-body-image {
        max-width: 100%;
        padding: 0.3rem;
        border: 0.1rem solid #ddd;
        margin: 3rem 0 2rem;
        box-sizing: border-box;
    }
    .post-body-content {
        font-size: 1.6rem;
        line-height: 3.2rem;
    }
    .post-body-button {
        font-size: 1.4rem;
        color: #fff;
        background: $theme-color;
        border: 0.2rem solid $theme-color;
        display: inline-block;
        transition-duration: 0.2s;
        transition-timing-function: ease-in-out;
        line-height: 2;
        padding: 0 2rem;
        margin: 4rem auto;
        position: relative;
        cursor: pointer;
        user-select: none;
    }
    .post-body-button:hover {
        border-color: $theme-color;
        color: $theme-color;
        background: #fff;
    }
    .post-body-button::after {
        content: "";
        width: 200%;
        position: absolute;
        bottom: -6rem;
        left: -50%;
        border-bottom: 0.1rem solid $theme-light-color;
        opacity: 0.3;
        z-index: -1;
    }
}

.end-pagination {
    margin-top: 3rem;
    mix-blend-mode: exclusion;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 28rem;
    transition: left 0.2s ease;
    .end-pagination-title {
        font-size: 1.9rem;
        font-weight: bold;
        user-select: none;
    }

    .end-pagination-item {
        font-size: 1.6rem;
        line-height: 1.25;
        font-weight: bold;
        color: #d9d9d9;
        width: 2rem;
        height: 2rem;
        border: 2px solid #d9d9d9;
        border-radius: 50%;
        margin: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        cursor: pointer;
    }

    .pagination-item-actived,
    .end-pagination-item:hover {
        color: $theme-color;
        border: 2px solid $theme-color;
    }
}

@media screen and (max-width: 860px) {
    .posts-expand {
        width: 96%;
    }

    .end-pagination {
        left: 0.5rem;
        margin-left: 0 !important;
    }
}
</style>