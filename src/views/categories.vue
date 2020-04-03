<template lang="pug">
    .categories-box
        .categories-box-title 日志自动划分为 {{categories.length}} 种类别～！
        .category-list
            .category-list-item(v-for="item in categories" :class="activeTitle==item.title?'active-title':''")
                span(@click="getPostList(item)") {{item.title}}
                span ┃ {{item.children.length}}
        hr
        .post-list
            .post-list-item(v-for="item in postList")
                a(@click="goToPost(item.routeName)") {{item.title}}
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      categoriesTitle: [],
      postList: [],
      activeTitle: ''
    }
  },
  components: {},
  computed: {},
  watch: {
    $store: {
      handler(res) {
        let postAll = [...res.state.markdownAll]
        postAll.map(item => {
          if (!this.categoriesTitle.includes(item.categories)) {
            this.categoriesTitle.push(item.categories)
            this.categories.push({
              title: item.categories,
              children: [item]
            })
          } else {
            this.categories.map(cItem => {
              if (item.categories == cItem.title) {
                cItem.children.push(item)
              }
            })
          }
        })
        this.getPostList(this.categories[0])
      },
      immediate: true
    }
  },
  mounted() { },
  methods: {
    getPostList(res) {
      this.activeTitle = res.title
      this.postList = res.children
    },
    goToPost(routeName) {
      if (!routeName) return
      this.$router.push({
        name: routeName
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.categories-box {
  font-size: 1.6rem;
  width: 70% !important;
  padding-top: 2rem;
}

@media screen and (max-width: 860px) {
  .categories-box {
    width: 96% !important;
  }
}

.categories-box-title {
  font-size: 2rem;
  line-height: 2;
  text-align: center;
  margin: 3rem 0 5rem;
}

.category-list,
.post-list {
  font-weight: bold;
  display: flex;
  flex-direction: column;
  padding-left: 4rem;
}

.post-list {
  padding-top: 1rem;
}

.post-list-item {
  margin-bottom: 2rem;
  cursor: pointer;
  user-select: none;
}

.category-list-item {
  position: relative;
  user-select: none;
  margin-bottom: 1.4rem;
  &::after {
    content: "";
    width: 1rem;
    height: 1rem;
    position: absolute;
    left: -2.2rem;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    border: 0.1rem solid #999;
  }

  &:hover::after {
    border: 0.1rem solid $theme-light-color;
  }

  > span:first-child {
    background-color: transparent;
    color: $theme-light-color;
    text-decoration: none;
    outline: none;
    cursor: pointer;
  }

  > span:last-child {
    color: #bbb;
    margin-left: 0.5rem;
  }
}

.active-title {
  &::after {
    border: 0.1rem solid $theme-light-color;
    background-color: $theme-light-color;
  }
}
</style>