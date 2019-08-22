<template lang="pug">
    .errors
        .errors-title
            svg-icon(icon-class="404" class="errors-icon")
        .button-gradient(@click="goToHome") HOME
</template>

<script>
export default {
	data() {
		return {}
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
.errors {
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.errors-title {
	font-size: 40rem;
	line-height: 1;
    margin-top: 20vh;
    margin-bottom: 4rem;  
}

@media screen and (max-width: 860px) {
	.errors-title {
		font-size: 20rem;
	}
}

.errors-icon {
	animation: errors 2s infinite ease-in-out alternate;
}

@keyframes errors {
	0% {
		transform: translateY(1rem);
	}
	100% {
		transform: translateY(-1rem);
	}
}
</style>