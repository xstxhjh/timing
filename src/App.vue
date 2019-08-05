<template lang="pug">
<<<<<<< HEAD
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
=======
#app
  router-view
</template>

<script>

export default {
  name: 'app'
>>>>>>> 2bd88d7666daf780c8ffd292e0bae77d847c7a83
}
</script>

<style lang="scss">
#app {
<<<<<<< HEAD
	font-family: 'Monaco','Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
=======
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
>>>>>>> 2bd88d7666daf780c8ffd292e0bae77d847c7a83
}
</style>
