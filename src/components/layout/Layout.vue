<template lang="pug">
    .main-layout
        .nav-views
            .nav-views-item Home
            .nav-views-item Archives
            .nav-views-item Categories
            .nav-views-item About

        router-view.layout-content

        .layout-end(@mouseenter="trapezoidMouseenter" @mouseleave="trapezoidMouseleave")
            a.end-trapezoid(href="https://github.com/xstxhjh" target="_blank")
              span Chirenmeng

</template>


<script>
export default {
  name: 'layout',
  components: {},
  data() {
    return {}
  },
  watch: {},
  filters: {},
  computed: {},
  created() { },
  mounted() {
    console.log()
  },
  methods: {
    trapezoidMouseenter() {
      TweenMax.to('.end-trapezoid', .3, {
        width: '210px',
        alpha: 0.5,
      })
    },
    trapezoidMouseleave() {
      TweenMax.to('.end-trapezoid', .3, {
        width: '200px',
        alpha: 1,
      })
    }
  }
}
</script>
<style scoped lang="scss">
.main-layout {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.layout-content {
  width: 100%;
  flex: 1;
}

.layout-end {
  display: flex;
  align-items: center;
  justify-content: center;
}

.end-trapezoid {
  font-size: 2rem;
  color: #fff;
  width: 20rem;
  height: 0;
  padding-top: 1rem;
  display: flex;
  justify-content: center;
  border: 1.4rem solid #fff;
  border-top: 0 solid;
  border-bottom: 3rem solid $theme-color;
  text-shadow: 0 0 0.3rem rgba(255, 255, 255, 0.5);
  text-decoration: none;
  user-select: none;

  span {
    margin-top: .5rem;
  }
}

.nav-views {
  display: flex;
  user-select: none;
  margin-top: 3rem;
}

.nav-views-item {
  color: $theme-color;
  white-space: nowrap;
  padding: 0.2rem 2rem;
  transition: 0.2s all linear;
  cursor: pointer;
  position: relative;
  border-top-left-radius: 0.2rem;
  border-top-right-radius: 0.2rem;
}

.nav-views-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 100%;
  width: 0;
  height: 100%;
  border-bottom: 0.2rem solid $theme-color;
  transition: 0.2s all linear;
}

.nav-views-item:hover::before {
  width: 100%;
  top: 0;
  left: 0;
  border-bottom-color: $theme-color;
  transition-delay: 0.1s;
  z-index: -1;
}

.nav-views-item:hover ~ .nav-views-item::before {
  left: 0;
}

.nav-views-item:active {
  background: $theme-color;
  color: #fff;
}
</style>