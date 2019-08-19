<template lang="pug">
    .archives-box
        .time-step
            .step-item(v-for="item in postAll" @click="goToPost(item.routeName)")
                .date-text {{item.dateMonthday}}
                .post-title {{item.title}}

</template>

<script>
export default {
	data() {
		return {
			postAll: []
		}
	},
	components: {},
	computed: {},
	mounted() {
		this.postAll = this.$store.state.markdownAll
		this.postAll.map(item => {
			item.dateYear = item.date.substring(0, 4)
			item.dateMonthday = item.date.substring(5, 10)
			return item
		})
		console.log(this.postAll)
	},
	methods: {
		goToPost(routeName) {
			this.$router.push({
				name: routeName
			})
		}
	}
}
</script>

<style lang='scss' scoped>
.archives-box {
	font-family: 'Roboto Slab', 'Monda', 'PingFang SC', 'Microsoft YaHei', sans-serif;
	font-size: 1.6rem;
	width: 50% !important;
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
	margin-left: 6rem;
	margin-top: 4%;
}

.step-item {
	color: #666;
	font-size: 1.2rem;
	position: relative;
	padding: .4rem 1.4rem;
	margin: 3rem 0;
	display: flex;
	align-items: center;
	user-select: none;
	cursor: pointer;

	.post-title {
		font-size: 1.6rem;
		margin-left: 1rem;
	}
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

.step-item:hover {
	&::before {
		background: $theme-dark-color;
	}
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