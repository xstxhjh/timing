<template lang="pug">
.container
    .posts-expand(v-for="(item,index) in postAll" :key="index")
        .post-header
            .post-header-title(@click="goToPost(item.routeName)") {{item.title}}
            .post-header-meta(v-html="`发表于 ${item.date} | 总计 ${item.wordCount} 个字`")
        .post-body
            img.post-body-image(:src="item.image")
            .post-body-content(v-html="item.description")
            .post-body-button(@click="goToPost(item.routeName)") 阅读全文 »
            
    .end-pagination
        .end-pagination-item 1
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {
            navIconOpen: false,
            postAll: []
        }
    },
    watch: {},
    filters: {},
    computed: {},
    methods: {
        navIconChange() {
            this.navIconOpen = !this.navIconOpen
        },
        goToPost(routeName) {
            this.$router.push({
                name: routeName
            })
        }
    },
    created() { },
    mounted() {
        this.postAll = this.$store.state.markdownAll
        console.log(this.postAll)


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
    width: 60%;
    padding-top: 4rem;
}

@media screen and (max-width: 860px) {
    .posts-expand {
        width: 96%;
    }
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
        width: 100%;
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
    width: 50%;
    padding: 2rem 20% 1rem;
    margin-top: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;

    .end-pagination-item {
        font-size: 1.6rem;
        width: 3rem;
        height: 3rem;
        background-color: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
            font-weight: bold;
            border: 1px solid $theme-color;
        }
    }
}
</style>