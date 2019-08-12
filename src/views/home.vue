<template lang="pug">
    .container
      svg-icon(icon-class="antDesign" style="width: 30px;height: 30px;margin: 0 16px")
      .button-gradient BACK
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      navIconOpen: false
    }
  },
  watch: {},
  filters: {},
  computed: {},
  methods: {
    navIconChange() {
      this.navIconOpen = !this.navIconOpen
    }
  },
  created() { },
  mounted() {
    this.$axios('https://easy-mock.com/mock/5c9ae664bbbd4054ae3c51c9/chirenmeng/test').then(res => {
      console.log(res)
    })
    function timeout(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'finish')
      })
    }
    async function asyncTimeSys() {
      await timeout(1000)
      console.log('第一层异步结束！')
      await timeout(1000)
      console.log('第二层异步结束！')
      await timeout(1000)
      console.log('第三层异步结束！')
      await timeout(1000)
      console.log('第四层异步结束！')
      await timeout(1000)
      console.log('第五层异步结束！')
      return 'all finish'
    }
    asyncTimeSys().then(value => {
      console.log(value)
    })
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>