<template>
	<div>
		<!-- 头部区域 -->
		<app-header />
		<!-- 左侧导航区域 -->
		<app-navbar />
		<!-- 右侧主体区域 -->
		<app-main />
	</div>
</template>

<script>
	import AppHeader from './AppHeader'
	import AppNavbar from './AppNavbar'
	import AppMain from './AppMain'
	
	export default {
		components: {
			AppHeader,
			AppNavbar,
			AppMain
		}
	}
</script>

<style scoped>
	
</style>
