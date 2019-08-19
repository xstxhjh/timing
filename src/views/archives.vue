<template lang="pug">
    .archives-box
        .time-step
            .step-item  03-31
            .step-item  03-31
            .step-item  03-31
            .step-item  03-31

</template>

<script>
export default {
	data() {
		return {}
	},
	components: {},
	computed: {},
	mounted() {},
	methods: {}
}
</script>

<style lang='scss' scoped>
.archives-box {
	font-size: 1.6rem;
	width: 60% !important;
	padding-top: 2rem;
}

@media screen and (max-width: 860px) {
	.archives-box {
		width: 96% !important;
	}
}

.time-step {
	display: flex;
	flex-direction: column;
}

.step-item {
	font-size: 1.2rem;
	height: 7rem;
	position: relative;
	padding-left: 1rem;
	display: flex;
	align-items: center;
}

.step-item::before {
	content: '';
	width: 1rem;
	height: 1rem;
	text-align: center;
	border-radius: 50%;
	background: #bbb;
	box-sizing: border-box;
	position: absolute;
	top: calc(50% - 1rem);
	left: -0.6rem;
	transform: translate(-50%, 50%);
}

.step-item:not(:last-child):after {
	content: '';
	height: 100%;
	width: 0.4rem;
	position: absolute;
	top: 0;
	left: 0;
	transform: translate(-100%, 50%);
	border-left: 0.4rem solid #f5f5f5;
	z-index: -1;
}
</style>