<template>
	<view class="shape">
		<swiper class="image-container example-body-item uni-swiper-wrapper" previous-margin="43rpx" next-margin="43rpx" circular  @change="swiperChange" :indicator-dots="false" interval="2500" autoplay>
			<swiper-item :class="currentIndex == index ? 'swiper-item' : 'swiper-item-side'" v-for="(item, index) in imgList" :key="item[urlKey]">
				<image  @click="clickImg(item)" :class="currentIndex == index ? 'item-img' : 'item-img-side'" :src="item.image" lazy-load :style="dontFirstAnimation ? 'animation: none;' : ''" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
	</view>
	
</template>
<script>
	export default {
		props: {
			imgList: {
				type: Array,
				default() {
					return []
				}
			},
			urlKey: {
				type: String,
				default() {
					return ''
				}
			}
		},
		data() {
			return {
				currentIndex: 0,
				dontFirstAnimation: true,
			}
		},
		methods: {
			swiperChange(e) {
				this.dontFirstAnimation = false
				this.currentIndex = e.detail.current
			},
			clickImg(item) {
				this.$emit('selected', item, this.currentIndex)
			}
		}
	}
</script>
<style lang="less">

	.example-body-item {
	
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 60rpx;
		display: flex;
		flex: 1;
	}
	.uni-swiper-wrapper {
		
		// /deep/ 深度选择器,使用后才可选 uni-swiper-dots 和 uni-swiper-dot
		
		/deep/ .uni-swiper-dots {
			top: 310rpx;
		}

		/deep/ .uni-swiper-dot {
			width: 25upx !important;
			height: 9upx !important;
			border-radius: 4rpx;
			background: #C0C0C0 !important;
		}

		/deep/ .uni-swiper-dot-active {
			width: 40upx !important;
			height: 8upx !important;
			background: #42E2CD !important;
			border-radius: 4rpx;
		}
	}

	.image-container {
		height: 360rpx;
	}

	.item-img {
		width: 650rpx;
		height: 360rpx;
		border-radius: 14rpx;
		animation: to-big .3s;
	}

	.swiper-item {
		width: 650rpx;
		height: 360rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.item-img-side {
		width: 650rpx;
		height: 320rpx;
		border-radius: 14rpx;
		animation: to-mini .5s;
	}

	.swiper-item-side {
		width: 650rpx;
		height: 320rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	@keyframes to-mini
	{
		from {
			height: 360rpx;
		}
		to {
			height: 320rpx;
		}
	}
	@keyframes to-big
	{
		from {
			height: 320rpx;
		}
		to {
			height: 360rpx;
		}
	}
</style>
