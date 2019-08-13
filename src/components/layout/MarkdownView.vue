<template lang="pug">
    router-view.router-post-body
</template>
<script>
export default {
	name: 'MarkdownView',
	data() {
		return {}
	},
	mounted() {},
	updated() {}
}
</script>

<style lang="scss" scoped>
.router-post-body {
	font-size: 1.4rem;
    padding: 0 25%;
    margin-top: 2rem;
	box-sizing: border-box;
}

@media screen and (max-width: 860px) {
	.router-post-body {
		padding: 0 4%;
    }
    .router-post-body /deep/ blockquote{
        margin: 0;
    }
}
</style>
