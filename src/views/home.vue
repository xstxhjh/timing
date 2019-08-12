<template lang="pug">
    .container
      .posts-expand(v-for="(item,index) in postAll" :key="index")
        .post-header
          .post-header-title {{item.title}}
          .post-header-meta(v-html="'发表于 '+item.date")
        .post-body
            img.post-body-image(:src="item.image")
    //-   svg-icon(icon-class="antDesign" style="width: 30px;height: 30px;margin: 0 16px")
    //-   .button-gradient BACK
</template>

<script>
export default {
	components: {},
	props: {},
	data() {
		return {
			navIconOpen: false,
			postAll: []
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
	created() {},
	mounted() {
		this.postAll = this.$store.state.markdownAll
		// this.$axios('https://easy-mock.com/mock/5c9ae664bbbd4054ae3c51c9/chirenmeng/test').then(res => {
		//   console.log(res)
		// })
		// function timeout(ms) {
		//   return new Promise((resolve, reject) => {
		//     setTimeout(resolve, ms, 'finish')
		//   })
		// }
		// async function asyncTimeSys() {
		//   await timeout(1000)
		//   console.log('第一层异步结束！')
		//   await timeout(1000)
		//   console.log('第二层异步结束！')
		//   await timeout(1000)
		//   console.log('第三层异步结束！')
		//   await timeout(1000)
		//   console.log('第四层异步结束！')
		//   await timeout(1000)
		//   console.log('第五层异步结束！')
		//   return 'all finish'
		// }
		// asyncTimeSys().then(value => {
		//   console.log(value)
		// })
	}
}
</script>

<style scoped lang="scss">
.container {
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 2rem;
}

.posts-expand {
	width: 60%;
	padding-top: 4rem;
}

@media screen and (max-width: 860px) {
	.posts-expand {
		width: 90%;
	}
}

.post-header {
	color: $theme-light-color;
	.post-header-title {
		font-size: 2.8rem;
		font-weight: bold;
		line-height: 3rem;
		margin: 2rem 0 1.4rem;
		transition: 0.1s all linear;
		display: inline-block;
		position: relative;
		cursor: pointer;
	}
	.post-header-title:before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: 0;
		height: 100%;
		border-bottom: 0.2rem solid $theme-light-color;
		transition: 0.2s all linear;
	}
	.post-header-title:hover::before {
		width: 100%;
		left: 0;
		border-bottom-color: $theme-light-color;
		transition-delay: 0.1s;
		z-index: -1;
	}
}
.post-header-meta {
	font-size: 1.3rem;
	color: #999;
}

.post-body {
	width: 90%;
	margin: 0 auto;
	.post-body-image {
		width: 100%;
		padding: 0.3rem;
		border: 0.1rem solid #ddd;
		margin: 3rem 0 2rem;
		box-sizing: border-box;
	}
}
</style>