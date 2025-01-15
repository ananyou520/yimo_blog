<template>
	<view>
		<view style="text-align: center;">
			<image v-if="type == 1" show-menu-by-longpress="true" style="width: 70%;margin-top: 200rpx;" mode="widthFix" src="/static/appimg/guanzhu.png"></image>
			<image v-if="type == 2" show-menu-by-longpress="true" style="width: 70%;margin-top: 200rpx;" mode="widthFix" src="/static/appimg/mywxcode.jpg"></image>
			<view style="font-size: 40rpx;font-weight: bold;margin-top: 40rpx;">长按识别二维码</view>
			<view style="font-size: 30rpx;color: #adadad;margin-top: 40rpx;">最新动态资源抢先看，精彩永不断</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: null
			}
		},
		onLoad(option) {
			this.type = option.type
		},
		methods: {
			
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff;
		min-height: 100%;
		height: auto;
	}

</style>
