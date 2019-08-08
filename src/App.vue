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
  mounted() { },
  methods: {}
}
</script>

<style lang="scss">
html {
  font-size: 62.5%;
  font-family: "Monaco", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
}

#app {
  height: 100vh;
}

@media (min-width: 300px) {
  #app {
    font-size: 1.4rem;
  }
}
@media (min-width: 520px) {
  #app {
    font-size: 1.6rem;
  }
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
@media (min-width: 1180px) {
  #app {
    font-size: 2.2rem;
  }
}
@media (min-width: 1400px) {
  #app {
    font-size: 2.4rem;
  }
}
</style>
