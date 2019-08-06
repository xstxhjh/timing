<template lang="pug">
  .app-container
    //- svg-icon(icon-class="antDesign" style="width: 30px;height: 30px;margin: 0 16px")
    //- img(src='https://i.loli.net/2019/08/05/Lo9nyjTO5ZUN6im.jpg' alt='avatar.jpg')
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
    }
  },
  watch: {},
  filters: {},
  computed: {},
  methods: {},
  created() { },
  mounted() { 
      console.log(process.env)
  }
}
</script>

<style scoped lang="scss">
.app-container{
    background: rgba($color: #000000, $alpha: 0.5);
}
</style>