<template lang="pug">
  .app-container
    .box-left
      img.avatar(src='https://i.loli.net/2019/08/05/Lo9nyjTO5ZUN6im.jpg')
      <div :class="['icon nav-icon',navIconOpen?'open':'']" @click="navIconChange">
        <span></span>
        <span></span>
        <span></span>
      </div>
    .box-center
      .nav-views
        .nav-views-item Home
        .nav-views-item Archives
        .nav-views-item Categories
        .nav-views-item About

      router-view.layout-content

      div(style="height:200px;")

      .layout-end(@mouseenter="trapezoidMouseenter" @mouseleave="trapezoidMouseleave")
          a.end-trapezoid(href="https://github.com/xstxhjh" target="_blank")
            span Chirenmeng
    .box-right
      .button-gradient NEXT

</template>


<script>
export default {
  name: 'layout',
  components: {},
  data() {
    return {
      navIconOpen: false
    }
  },
  watch: {},
  filters: {},
  computed: {},
  created() { },
  mounted() {
    console.log()
  },
  methods: {
    navIconChange() {
      this.navIconOpen = !this.navIconOpen
    },
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
.app-container {
  width: 100%;
  min-height: 100%;
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
    box-shadow: 0 0 1rem #ccc;
    border: 0.1rem solid #ddd;
    transition: transform 4s ease;
  }

  .avatar:hover {
    box-shadow: 0 0 1rem #888;
    transform: rotateZ(3600deg);
  }
}

.box-center {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .layout-content {
    width: 100%;
    flex: 1;
  }

  .layout-end {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// 中间 底部博客按钮
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
    margin-top: 0.5rem;
  }
}

// 中间导航栏
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

// 左边菜单图标按钮
.nav-icon {
  width: 30px;
  height: 24px;
  margin: 10px;
  position: relative;
  cursor: pointer;
  display: inline-block;
}
.nav-icon span {
  background-color: $theme-color;
  position: absolute;
  border-radius: 2px;
  transition: 0.3s cubic-bezier(0.8, 0.5, 0.2, 1.4);
  width: 100%;
  height: 4px;
  transition-duration: 500ms;
}
.nav-icon span:nth-child(1) {
  top: 0;
  left: 0;
}
.nav-icon span:nth-child(2) {
  top: 10px;
  left: 0;
  opacity: 1;
}
.nav-icon span:nth-child(3) {
  bottom: 0;
  left: 0;
}
.nav-icon:not(.open):hover span:nth-child(1) {
  transform: scaleX(0.8);
}
.nav-icon:not(.open):hover span:nth-child(2) {
  transform: scaleX(0.5);
}
.nav-icon:not(.open):hover span:nth-child(3) {
  transform: scaleX(0.8);
}
.nav-icon.open span:nth-child(1) {
  transform: rotate(45deg);
  top: 12px;
}
.nav-icon.open span:nth-child(2) {
  transform: translate(-10px, 0);
  opacity: 0;
}
.nav-icon.open span:nth-child(3) {
  transform: rotate(-45deg);
  top: 12px;
}
</style>