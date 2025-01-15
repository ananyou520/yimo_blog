<template name="basics">
	<view>
		<scroll-view scroll-y class="page">
			<view class="response"
				style="height: 250upx;line-height: 400upx;font-size: 32rpx;font-weight: bold;text-align: center;">
				敬请期待更多类别</view>
			<view class="nav-list">
				<navigator hover-class="none" :url="'/pages/tool/' + item.name" class="nav-li" navigateTo :class="'bg-'+item.color"
				 :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]" v-for="(item,index) in elements" :key="index">
					<view class="mt30 grid text-center bg-white" style="flex-direction: column; align-items: center;">
						<view class=" flex justify-center align-center" style="width: 100upx;height: 100upx;">
							<image class="grid-svg" style="width: 100%;height: 100%;" :src="item.cuIcon" mode="">
							</image>
						</view>
						<view style="font-weight: bold;margin-top: 16rpx;">{{item.title}}</view>
						<view style="font-size: 24rpx;color: #b1b1b1;">{{item.name}}</view>
					</view>
				</navigator>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "basics",
		data() {
			return {
				elements: [{
						title: '资源库',
						name: 'resource',
						color: 'cyan',
						cuIcon: '/static/imgs/zyk.png'
					},
					{
						title: '手机壁纸',
						name: 'wallpaper',
						color: 'purple',
						cuIcon: '/static/imgs/sjbz.png'
					},
					{
						title: '电脑壁纸',
						name: 'computer',
						color: 'pink',
						cuIcon: '/static/imgs/dnbz.png'
					},
					{
						title: '精美头像',
						name: 'avatar',
						color: 'brown',
						cuIcon: '/static/imgs/jmtx.png'
					},
					{
						title: '视频资源',
						name: 'video',
						color: 'blue',
						cuIcon: '/static/imgs/sp.png'
					},
					{
						title: '水印去除',
						name: 'shuiyin',
						color: 'red',
						cuIcon: '/static/imgs/sycc.png'
					},
					{
						title: '手机软件',
						name: 'phone',
						color: 'orange',
						cuIcon: '/static/imgs/sjrj.png'
					},
					{
						title: '电脑软件 ',
						name: 'software',
						color: 'mauve',
						cuIcon: '/static/imgs/dnrj.png'
					},
					{
						title: '积分兑换',
						name: 'exchange',
						color: 'green',
						cuIcon: '/static/imgs/jfdh.png'
					}
				],
			};
		},
		onShow() {
			console.log("success")
		}
	}
</script>

<style>
	.page {
		height: 100vh;
	}

	page {
		background-color: #F5F5F5;;
	}
		.nav-li {
			/* padding: 30upx; */
			border-radius: 24upx;
			width: 30%;
			margin: 0 1% 20upx;
			/* background-image: url(https://i.imgtg.com/2022/12/15/Dsef6.jpg); */
			background-size: cover;
			background-position: center;
			position: relative;
			background-color: #FFFFFF;
			z-index: 1;
		}
</style>