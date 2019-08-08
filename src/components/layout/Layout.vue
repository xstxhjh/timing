<template lang="pug">
    .main-layout
        .nav-views
            .nav-views-item 首页
            .nav-views-item 文章
            .nav-views-item 分类
            .nav-views-item 简介

        router-view.layout-content

        .layout-end
            a.end-trapezoid(href="https://github.com/xstxhjh" target="_blank") chirenmeng

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
	methods: {},
	created() {},
	mounted() {}
}
</script>
<style scoped lang="scss">
.main-layout {
	width: 100%;
	height: 100%;
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
	color: #fff;
	width: 200px;
	height: 0;
	display: flex;
	justify-content: center;
	border: 1rem solid #fff;
	border-top: 0 solid;
	border-bottom: 3rem solid #333;
	text-decoration: none;
}

.nav-views {
	display: flex;
	user-select: none;
	margin-top: 3rem;
}

.nav-views-item {
	color: #333;
	white-space: nowrap;
	padding: 2px 2rem 0 2rem;
	transition: 0.2s all linear;
	cursor: pointer;
	position: relative;
	border-top-left-radius: 2px;
	border-top-right-radius: 2px;
}

.nav-views-item::before {
	content: '';
	position: absolute;
	top: 0;
	left: 100%;
	width: 0;
	height: 100%;
	border-bottom: 2px solid #333;
	transition: 0.2s all linear;
}

.nav-views-item:hover::before {
	width: 100%;
	top: 0;
	left: 0;
	border-bottom-color: #333;
	transition-delay: 0.1s;
	z-index: -1;
}

.nav-views-item:hover ~ .nav-views-item::before {
	left: 0;
}

.nav-views-item:active {
	background: #333;
	color: #fff;
}
</style>