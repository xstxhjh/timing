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
		let arr = []
		data.map(item => {
			let fileContent = item.fileContent
			let title = fileContent.match(/\[title\]:#\((.*?)\)/)
			let date = fileContent.match(/\[date\]:#\((.*?)\)/)
			let categories = fileContent.match(/\[categories\]:#\((.*?)\)/)
			let description = fileContent.match(/\[description\]:#\((.*?)\)/)
			let image = fileContent.match(/\[image\]:#\((.*?)\)/)
			arr.push({
				title: title && title[1],
				date: date&& date[1],
				categories: categories && categories[1],
				description: description && categories[1],  
				image: image && categories[1],
				timeDate: item.timeDate,
                routeName: item.routeName,
                wordCount: item.wordCount
			})
			this.$store.commit('setMarkdownAll', arr)
        })
	},
	mounted() {},
	methods: {}
}
</script>

<style lang="scss">
html {
	color: #333;
	font-size: 62.5%;
	font-family: 'Monda', 'PingFang SC', 'Microsoft YaHei', sans-serif;
	// font-family: 'Monaco', 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	overflow-x: hidden;
}

body {
    margin: 0;
}

html,
body,
#app {
	height: 100%;
}

@media (max-width: 600px) {
	#app {
		font-size: 1.5rem;
	}
}
@media (min-width: 600px) {
	#app {
		font-size: 1.7rem;
	}
}
@media (min-width: 768px) {
	#app {
		font-size: 1.9rem;
	}
}
@media (min-width: 992px) {
	#app {
		font-size: 2.1rem;
	}
}
@media (min-width: 1200px) {
	#app {
		font-size: 2.3rem;
	}
}
</style>
