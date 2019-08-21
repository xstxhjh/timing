<template lang="pug">
    .categories-box
</template>

<script>
export default {
	data() {
		return {
			categories: []
		}
	},
	components: {},
	computed: {},
	watch: {
		$store: {
			handler(res) {
				let postAll = [...res.state.markdownAll]
				postAll.map(item => {
					if (!this.categories.includes(item.categories)) {
						this.categories.push({
							title: item.categories,
							children: [item]
						})
					} else {
						this.categories.map(cItem => {
							if (item.categories == cItem.title) {
								cItem.children.push(item)
							}
						})
					}
				})
				console.log(this.categories)
			},
			immediate: true
		}
	},
	mounted() {},
	methods: {}
}
</script>

<style lang='scss' scoped>
.categories-box {
	font-size: 1.6rem;
	width: 50% !important;
	padding-top: 2rem;
}

@media screen and (max-width: 860px) {
	.categories-box {
		width: 96% !important;
	}
}
</style>