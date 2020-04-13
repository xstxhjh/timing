<template lang="pug">
.post-box
    router-view.router-post-body
    .right-anchor
        .right-anchor-link(
            v-for="(item, index) in anchor"
            :key="index"
            :class="{'right-anchor-link-actived': (item.offsetTop <= offsetTop) && (offsetTop < ((index+1)==anchor.length?Infinity:anchor[index+1].offsetTop))}"
            )
            a(@click="anchorTo(item.offsetTop)") {{item.title}}
            .right-anchor-link(
                v-for="(item, index) in item.children"
                :key="index" :ref="'anchorChildren'+index"
                )
                a(@click="anchorTo(item.offsetTop)") {{item.title}}
</template>

<script>
hljs.highlightCode = function () {
    // 在 $route 改变进行跳转时，vue 会重新渲染页面，并移除页面上所有事件。
    // 所以在渲染页面后，监听已经被移除了，也就不会再进行语法高亮了。
    let blocks = document.querySelectorAll('pre code')
    ![].forEach.call(blocks, hljs.highlightBlock)
}

export default {
    name: 'MarkdownView',
    data() {
        return {
            anchor: [],
            offsetTop: 0
        }
    },
    watch: {
        '$parent.topValue': {
            immediate: false,
            handler(topValue, oldVal) {
                let offsetTop = document.body.scrollTop || document.documentElement.scrollTop || window.pageXOffset
                this.offsetTop = offsetTop + 180
            }
        }
    },
    methods: {
        anchorTo(offsetTop) {
            offsetTop = offsetTop - 60
            TweenMax.to(window, 0, { scrollTo: offsetTop })
        },
    },
    mounted() {
        // highlight.js 代码高亮
        hljs.highlightCode()
        setTimeout(() => {
            let dom = document.getElementsByClassName('router-post-body')[0].children
            let anchor = []
            let isTitle = false
            ![...dom].map(item => {
                if (item.localName == 'h1') {
                    anchor.push({
                        title: item.innerText,
                        offsetTop: item.offsetTop,
                        children: []
                    })
                    isTitle = anchor[anchor.length - 1]
                } else if (item.localName == 'h2') {
                    isTitle.children.push({
                        title: item.innerText,
                        offsetTop: item.offsetTop,
                        children: []
                    })
                }
            })
            this.anchor = anchor
        }, 1000)
    },
    activated() { },
    updated() { }
}
</script>

<style>
.router-post-body-image {
    width: 100%;
}
</style>

<style lang="scss" scoped>
.router-post-body {
    font-family: "Monda", "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 1.6rem;
    color: $theme-light-color;
    line-height: 1.4;
    padding: 0 20%;
    margin-top: 2rem;
    box-sizing: border-box;

    /deep/ h1 {
        font-size: 3rem;
    }
    /deep/ h2 {
        font-size: 2.6rem;
    }
    /deep/ h3 {
        font-size: 2.2rem;
    }
}

@media screen and (max-width: 860px) {
    .router-post-body {
        font-size: 1.3rem;
        padding: 0 4%;
    }
    .router-post-body /deep/ blockquote {
        margin: 0;
    }
}

</style>
