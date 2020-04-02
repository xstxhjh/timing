<template lang="pug">
.post-box
    router-view.router-post-body
    .right-anchor
        .right-anchor-ink 
        .right-anchor-link(
            v-for="(item, index) in anchor"
            :key="index" :ref="'anchor'+index")
            a(@click="anchorTo(item.offsetTop)") {{item.title}}
            .right-anchor-link(
                v-for="(item, index) in item.children"
                :key="index" :ref="'anchorChildren'+index")
                a(@click="anchorTo(item.offsetTop)") {{item.title}}
</template>

<script>
hljs.highlightCode = function () {
    //自定义highlightCode方法，将只执行一次的逻辑去掉
    let blocks = document.querySelectorAll('pre code')
    ![].forEach.call(blocks, hljs.highlightBlock)
}

export default {
    name: 'MarkdownView',
    data() {
        return {
            anchor: []
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
    },
    activated() { },
    updated() { }
}
</script>

<style lang="scss" scoped>
.router-post-body {
    font-family: "Monda", "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 1.6rem;
    color: $theme-light-color;
    line-height: 1.4;
    padding: 0 25%;
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
