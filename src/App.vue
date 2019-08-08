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
		let data = JSON.parse(process.env.VUE_APP_MD_FILES)
		let fileContent = data[0].fileContent
		console.log(fileContent.match(/\[title\]:#\((.*?)\)/)[1])
	},
	mounted() {},
	methods: {}
}
</script>

<style lang="scss">
html {
	font-size: 62.5%;
	font-family: 'Monaco', 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

@media (min-width: 640px) {
	#app {
		font-size: 1.8rem;
	}
}

@media (min-width: 960px) {
	#app {
		font-size: 2rem;
	}
}

@media (min-width: 1200px) {
	#app {
		font-size: 2.2rem;
	}
}
</style>
