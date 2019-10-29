<template>
	<div class="main">
		<Link v-show="$route.path !== '/home'"/>
		<router-view></router-view>
	</div>
</template>

<script>
	import Link from './link'
	export default {
		components: {
			Link
		}
	}
</script>

<style scoped>
	/* 右侧主区域 */
	.main {
		position: absolute;
		top: 50px;
		left: 230px;
		right: 0px;
		bottom: 0px;
		padding: 10px;
		overflow-y: auto;
	}
</style>
