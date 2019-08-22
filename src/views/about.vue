<template lang="pug">
    .about-box
      .about-box-title 关于博客
      .about-box-content(v-html="project")
      .box-border
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
			Profile: `技术栈：Vue、小程序、PHP、Node.js、Mysql、Linux、Shell、photoshop、Hexo<br/>
                自我简述：网络安全技术专业，热忱于前端，有一定的产品设计能力。<br/>
                联系方式：573363596@qq.com<br/>`
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

.box-border {
	margin: 3rem 0;
	height: 0.3rem;
	border: none;
	background-color: #ddd;
	background-image: repeating-linear-gradient(-45deg, #fff, #fff 0.4rem, transparent 0.4rem, transparent 0.8rem);
}

.go-home {
	margin: 6rem auto 0;
}
</style>