<template lang="pug">
    #app
        router-view
</template>

<script>
export default {
	name: 'app',
	data() {
		return {}
	},
	created() {
		this.removeLoadingNode()
	},
	methods: {
		removeLoadingNode() {
			let getLoadingNode = document.getElementById('Loading')
			let body = document.body
			if (getLoadingNode) {
				body.removeChild(getLoadingNode)
			}
		}
	}
}
</script>

<style lang="scss">
#app {
	font-family: 'Monaco','Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
</style>
