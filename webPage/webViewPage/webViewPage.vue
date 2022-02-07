<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad(options){
			this.url = options.url;
			console.log(this.url)
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
