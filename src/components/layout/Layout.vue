<template lang="pug">
  .app-container
    .box-left
      .box-left-content
        img.avatar(src='https://i.loli.net/2019/08/05/Lo9nyjTO5ZUN6im.jpg')
      <div :class="['nav-icon',navIconOpen?'open':'']" @click="navIconChange">
        <span></span>
        <span></span>
        <span></span>
      </div>
    .box-center
      .nav-views
        div(:class="['nav-views-item',currentRouteName=='home'?'nav-views-item-active':'']") Home
        div(:class="['nav-views-item',currentRouteName=='archives'?'nav-views-item-active':'']") Archives
        div(:class="['nav-views-item',currentRouteName=='categories'?'nav-views-item-active':'']") Categories
        div(:class="['nav-views-item',currentRouteName=='about'?'nav-views-item-active':'']") About

      router-view.layout-content
      .button-gradient BACK
      div(style="height:2000px;")

      .layout-end(@mouseenter="trapezoidMouseenter" @mouseleave="trapezoidMouseleave")
          a.end-trapezoid(href="https://github.com/xstxhjh" target="_blank")
            span Chirenmeng
</template>


<script>
export default {
  name: 'layout',
  components: {},
  data() {
    return {
      navIconOpen: false,
      currentRouteName: ''
    }
  },
  watch: {
    $route: {
      handler(res) {
        this.currentRouteName = res.name
      },
      immediate: true
    },
  },
  filters: {},
  computed: {},
  created() { },
  mounted() { },
  methods: {
    navIconChange() { // 点击左边菜单图标按钮
      this.navIconOpen = !this.navIconOpen
      if (!this.navIconOpen) {
        TweenMax.to('.box-left', .4, {
          width: '0'
        })
        TweenMax.to('.avatar', .2, {
          opacity: 0
        })
      } else {
        TweenMax.to('.box-left', .2, {
          width: '32rem'
        })
        TweenMax.to('.avatar', .2, {
          opacity: 1
        })
      }
    },
    trapezoidMouseenter() { // 鼠标移入改变博客按钮样式
      TweenMax.to('.end-trapezoid', .3, {
        width: '21rem',
        opacity: 0.5,
      })
    },
    trapezoidMouseleave() {
      TweenMax.to('.end-trapezoid', .3, {
        width: '20rem',
        opacity: 1,
      })
    }
  }
}
</script>
<style scoped lang="scss">
.app-container {
  width: 100%;
  min-height: 100%;
  display: flex;
}

.box-left {
  background: $theme-dark-color;
  display: flex;
  align-items: center;
  justify-content: center;
  .box-left-content {
    position: fixed;
    top: 2%;
    .avatar {
      width: 10rem;
      height: 10rem;
      border: 0.4rem solid $theme-color;
      border-radius: 50%;
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.8);
      border: 0.2rem solid rgba(221, 221, 221, 0.3);
      transition: transform 4s ease;
      opacity: 0;
    }
  }

  .avatar:hover {
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

// 中间的导航栏
.nav-views {
  position: sticky;
  top: 0;
  display: flex;
  user-select: none;
  margin-top: 3rem;
  mix-blend-mode: exclusion;
  border: 0 solid;
  border-top: 0 solid;
  border-bottom: 0.1rem solid #fff;
}

.nav-views-item {
  color: $theme-color;
  white-space: nowrap;
  padding: 0.2rem 2rem;
  transition: 0.2s all linear;
  cursor: pointer;
  position: relative;
}

.nav-views-item-active {
  font-weight: bold;
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
  width: 18px;
  height: 15px;
  margin: 10px;
  position: fixed;
  bottom: 4rem;
  left: 3rem;
  display: inline-block;
  cursor: pointer;
}

.nav-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160%;
  height: 190%;
  border-radius: 0.2rem;
  background: $theme-dark-color;
}

.nav-icon span {
  background-color: #fff;
  position: absolute;
  border-radius: 2px;
  transition: 0.3s cubic-bezier(0.8, 0.5, 0.2, 1.4);
  width: 100%;
  height: 3px;
  transition-duration: 500ms;
}
.nav-icon span:nth-child(1) {
  top: 0;
  left: 0;
}
.nav-icon span:nth-child(2) {
  top: 6px;
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
  top: 6px;
}
.nav-icon.open span:nth-child(2) {
  transform: translate(-10px, 0);
  opacity: 0;
}
.nav-icon.open span:nth-child(3) {
  transform: rotate(-45deg);
  top: 6px;
}
</style>