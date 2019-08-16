<template lang="pug">
    .container(ref="highlight")
      pre
        code {{cv}}
          
</template>

<script>
export default {
	data() {
		return {
		}
	},
	components: {},
	computed: {},
	mounted() {
		// window.hljs.highlightBlock(this.$refs.highlight)
	},
	methods: {}
}
</script>

<style lang='scss' scoped>
</style>