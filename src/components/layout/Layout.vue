<template lang="pug">
    .main-layout
        .button-gradient NEXT
        .nav-views
            .nav-views-item 不可思议的CSS
            .nav-views-item 导航栏
            .nav-views-item 光标下划线跟随
            .nav-views-item PURE CSS
            .nav-views-item Coco
        router-view
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

.nav-views {
	display: flex;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	user-select: none;
}

.nav-views-item {
	color: #333;
    white-space: nowrap;
    padding: 1px 20px 0 20px;
	transition: 0.2s all linear;
	cursor: pointer;
    position: relative;
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