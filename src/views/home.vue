<template lang="pug">
    .app-container
      .box-left
        img.avatar(src='https://i.loli.net/2019/08/05/Lo9nyjTO5ZUN6im.jpg')
      .box-center
        div(style="height:2000px;")
      .box-right
        .button-gradient NEXT
      //- svg-icon(icon-class="antDesign" style="width: 30px;height: 30px;margin: 0 16px")
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  watch: {},
  filters: {},
  computed: {},
  methods: {},
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
.app-container {
  display: grid;
  grid-template-columns: 30% auto 30%;
}

.box-left {
	text-align: center;
  .avatar {
    width: 8rem;
    height: 8rem;
    border: 0.4rem solid $theme-color;
    border-radius: 50%;
    position: sticky;
    top: 20%;
  }
}
</style>