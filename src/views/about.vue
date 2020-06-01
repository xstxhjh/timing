<template lang="pug">
    .about-box
      .about-box-title 关于博客
      .about-box-content(v-html="project")
      hr
      .about-box-title 关于作者
      .about-box-content(v-html="Profile")

      .button-gradient.go-home(@click="goToHome") HOME
</template>

<script>
export default {
	data() {
		return {
			project: `　　这个博客项目是我于2019年7月28日，心血来潮搭建起来的轻量级SPA博客。
                之前写博客用的是Hexo，后来感觉项目太厚重了，于是乎摒弃了它。<br /><br />
                🇨🇳 <a target="_blank" href="https://github.com/xstxhjh/timing" class="cc-by-link">此开源项目代码</a> <br/>
                主体框架：Vue-cli3、Vue-router、Vuex、axios。<br />
                迅捷开发：pug、scss、moment.js、pace.js、highlight.js、TweenMax.js。<br/>
                项目优化：cdn、svg、md。<br/>`,
			Profile: `技术栈：Vue、React、小程序、Node.js、Mongodb、Mysql、PHP、photoshop、Hexo、Linux、Shell<br/>
                简述：不要忘了和大家一起交流，这样你的作品才会出彩~！<br/>
                QQ：573363596<br/>
                微信：xstxhjh`
		}
	},
	components: {},
	computed: {},
	mounted() {},
	methods: {
		goToHome() {
			this.$router.push({
				name: 'home'
			})
		}
	}
}
</script>

<style lang='scss' scoped>
.about-box {
	font-size: 1.6rem;
	line-height: 2;
	width: 60% !important;
	padding-top: 2rem;

	.about-box-title {
		font-size: 3rem;
		line-height: 8rem;
		font-weight: bold;
		text-align: center;
	}
}

@media screen and (max-width: 860px) {
	.about-box {
		width: 96% !important;
	}
}

.go-home {
	margin: 6rem auto 0;
}
</style>