<template lang="pug">
    router-view.router-post-body
</template>

<script>
hljs.highlightCode = function() {
	//自定义highlightCode方法，将只执行一次的逻辑去掉
	let blocks = document.querySelectorAll('pre code')
	;[].forEach.call(blocks, hljs.highlightBlock)
}

export default {
	name: 'MarkdownView',
	data() {
		return {}
	},
	mounted() {
		// highlight.js 代码高亮
		hljs.highlightCode()
	},
	activated() {},
	updated() {}
}
</script>

<style lang="scss" scoped>
.router-post-body {
	font-family: 'Monda', 'PingFang SC', 'Microsoft YaHei', sans-serif;
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
