<template lang="pug">
  .app-container
    .box-left
      .box-left-content
        .box-left-info(v-show="navIconOpen")
          img.avatar(src='https://i.loli.net/2019/08/05/Lo9nyjTO5ZUN6im.jpg')
          router-link(to="about").nickname Chirenmeng
          .sketch 一个属于前端的博客
          a(target="_blank" href="https://github.com/xstxhjh").github
            svg-icon(icon-class="github" class="github-icon")
            span GitHub
          a(target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" class="cc-by-link")
            svg-icon(icon-class="cc-by-nc-sa" class="cc-by-icon")
          .blogroll
            svg-icon(icon-class="blogroll" class="blogroll-icon")
            span 友情链接
          a(target="_blank" href="https://github.com/30-seconds/30-seconds-of-code").blogroll-link 30-seconds-of-code
          a(target="_blank" href="https://juejin.im/post/59097cd7a22b9d0065fb61d2").blogroll-link 手摸手，带你用vue撸后台

        div(:class="['nav-icon',navIconOpen?'open':'']" @click="navIconChange")
          span
          span
          span

    .box-center(ref='boxHeight')
      .nav-views
        div(:class="['nav-views-item',currentRouteName=='home'?'nav-views-item-active':'']" @click="goToMain('home')") Home
        div(:class="['nav-views-item',currentRouteName=='archives'?'nav-views-item-active':'']" @click="goToMain('archives')") Archives
        div(:class="['nav-views-item',currentRouteName=='categories'?'nav-views-item-active':'']") Categories
        div(:class="['nav-views-item',currentRouteName=='about'?'nav-views-item-active':'']" @click="goToMain('about')") About
      router-view.layout-content
      .layout-end(@mouseenter="trapezoidMouseenter" @mouseleave="trapezoidMouseleave")
        a.end-trapezoid(href="https://github.com/xstxhjh" target="_blank")
          span Chirenmeng
					

      transition(name='fade' mode='out-in')
        .ProgressBar(v-show="topValue>0" @click="backTop")
          span {{topValue}}%
          span ☂
</template>


<script>
import { setTimeout } from 'timers'
export default {
  name: 'layout',
  components: {},
  data() {
    return {
      navIconOpen: true,
      currentRouteName: '',
      topValue: '0%'
    }
  },
  watch: {
    $route: {
      handler(res) {
        this.currentRouteName = res.name
      },
      immediate: true
    },
    navIconOpen: {
      handler(navIconOpen) {
        if (!navIconOpen) {
          TweenMax.to('.box-left', 0.4, {
            width: '0'
          })
        } else {
          TweenMax.to('.box-left', 0.2, {
            width: '32rem'
          })
          TweenMax.to('.avatar', 0.2, {
            opacity: 1
          })
        }
      },
      immediate: true
    }
  },
  filters: {},
  computed: {},
  created() { },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    backTop() {
      TweenMax.to(window, 0.4, { scrollTo: 0 })
    },
    handleScroll() {
      if (!this.handleScroll.debounce) {
        let clientHeight = document.body.clientHeight || document.documentElement.clientHeight
        let scrollHeight = this.$refs.boxHeight.scrollHeight
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.pageXOffset
        this.$nextTick(() => {
          let topValue = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
          this.topValue = topValue >= 100 ? 100 : topValue
        })
        this.handleScroll.debounce = true
        setTimeout(() => {
          this.handleScroll.debounce = false
        }, 0)
      }
    },
    goToMain(routeName) {
        document.title = `Timing | ${routeName}`
      this.$router.push({
        name: routeName
      })
    },
    navIconChange() {
      // 点击左边菜单图标按钮
      this.navIconOpen = !this.navIconOpen
    },
    trapezoidMouseenter() {
      // 鼠标移入改变博客按钮样式
      TweenMax.to('.end-trapezoid', 0.3, {
        width: '18rem',
        opacity: 0.5
      })
    },
    trapezoidMouseleave() {
      TweenMax.to('.end-trapezoid', 0.3, {
        width: '17rem',
        opacity: 1
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
  width: 32rem;
  background: $theme-dark-color;
  display: flex;
  align-items: center;
  justify-content: center;
  .box-left-content {
    position: fixed;
    top: 2%;
    .box-left-info {
      font-size: 1.6rem;
      letter-spacing: 0.3rem;
      color: #999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .avatar {
      width: 10rem;
      height: 10rem;
      border: 0.4rem solid $theme-color;
      border-radius: 50%;
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.8);
      border: 0.2rem solid rgba(221, 221, 221, 0.3);
      transition: transform 1s ease;
      opacity: 1;
    }
    .nickname {
      color: #f5f5f5;
      cursor: pointer;
      margin: 2rem 0;
      text-decoration: none;
      &:hover {
        color: #fc6423;
      }
    }
    .sketch {
      margin-bottom: 3rem;
    }
    .github {
      font-size: 1.3rem;
      color: #999;
      text-decoration: none;
      letter-spacing: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 3rem;
      padding-bottom: 0.4rem;
      border-bottom: 0.1rem solid $theme-light-color;
      cursor: pointer;
      ::before {
        display: inline-block;
        vertical-align: middle;
        margin-right: 3px;
        content: " ";
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #ffbf18;
      }
      &:hover {
        color: #f5f5f5;
        border-bottom: 0.1rem solid #f5f5f5;
      }
      .github-icon {
        width: 1.6rem;
        height: 1.6rem;
        margin-right: 0.4rem;
      }
    }
    .cc-by-link {
      text-align: center;
      &:hover {
        border-bottom: .1rem solid rgba(0, 0, 0, 0);
      }
      .cc-by-icon {
        width: 8rem;
        height: 1.5rem;
        cursor: pointer;
      }
    }
    .blogroll {
      color: #fff;
      margin: 4rem 0 1rem;
      font-size: 1.6rem;
      letter-spacing: 0;
      margin-right: 0.4rem;
      .blogroll-icon {
        margin-right: 0.4rem;
      }
    }
    .blogroll-link {
      font-size: 1.3rem;
      color: #999;
      text-decoration: none;
      letter-spacing: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      padding-bottom: 0.4rem;
      border-bottom: 0.1rem solid $theme-light-color;
      cursor: pointer;
      &:hover {
        color: #f5f5f5;
        border-bottom: 0.1rem solid #f5f5f5;
      }
    }
  }

  .avatar:hover {
    transform: rotateZ(360deg);
  }
}

@media screen and (max-width: 860px) {
  .box-left {
    display: none;
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
    padding-bottom: 2rem;
  }

  .layout-end {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// 百分比进度条
.ProgressBar {
  font-size: 1.3rem;
  color: #fff;
  width: 6.4rem;
  height: 3rem;
  background: $theme-dark-color;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.7rem;
  box-sizing: border-box;
  position: fixed;
  bottom: 4rem;
  right: 3rem;
  border-radius: 0.2rem;

  > span:last-child {
    font-size: 1.6rem;
    margin-bottom: 0.3rem;
    font-weight: bold;
  }
}

// 中间 底部博客按钮
.end-trapezoid {
  font-size: 1.7rem;
  letter-spacing: 0.1rem;
  color: #fff;
  width: 17rem;
  height: 0;
  padding-top: 1rem;
  display: flex;
  justify-content: center;
  border: 1.4rem solid transparent;
  border-top: 0 solid transparent;
  border-bottom: 2.8rem solid $theme-color;
  text-shadow: 0 0 0.3rem rgba(255, 255, 255, 0.5);
  text-decoration: none;
  user-select: none;

  span {
    margin-top: 0.4rem;
  }
}

@media screen and (max-width: 860px) {
  .end-trapezoid {
    transform: scale(0.5, 0.5) translate(0, 50%);
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
  background: rgba(255, 255, 255, 1);
  border-bottom-left-radius: 0.3rem;
  border-bottom-right-radius: 0.3rem;
}

.nav-views-item {
  color: $theme-color;
  white-space: nowrap;
  padding: 0.2rem 2rem;
  transition: 0.2s all linear;
  position: relative;
  cursor: pointer;
}

@media screen and (max-width: 860px) {
  .nav-views-item {
    padding: 0.2rem 1rem;
  }
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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4rem);
}
</style>