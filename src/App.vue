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

#app {
	height: 100vh;
	font-size: 2rem;
}
</style>
