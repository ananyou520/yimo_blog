<template>
	<view>
		<view class="goods-list">
			<view class="list">
				<view class="pictrue">
					<image :src="baseUrl+goodsImg"></image>
				</view>
				<view class="price-info">
					<view class="user-price">
						<text class="cuIcon-vip min"></text>
						<text class="max">{{ goodsExchange }}</text>
					</view>
				</view>
				<view class="title-tag">
					<view class="tag">
						<text v-if="isHot == 0">火爆</text>
						{{ goodsName }}
					</view>
				</view>

			</view>
		</view>
		<view style="width: 100%;height: 1rpx;background-color: #F1F1F1;"></view>
		<view class="cu-timeline">
			<view class="buzou">积分物品兑换步骤</view>
			<view class="cu-item text-green cuIcon-noticefill">
				<view class="content bg-green shadow-blur">
					1.立刻兑换生成兑换码
				</view>
			</view>
			<view class="cu-item text-red cuIcon-servicefill">
				<view class="content bg-red shadow-blur">
					2.点击联系客服或我的界面中找到联系我们
				</view>
			</view>
			<view class="cu-item text-cyan cuIcon-evaluate_fill">
				<view class="content bg-cyan shadow-blur">
					3.将生成的兑换码发送给客服
				</view>
			</view>
			<view class="cu-item text-blue cuIcon-goodsfill">
				<view class="bg-blue content">
					4.与客服沟通进行积分商品的进一步兑换
				</view>
			</view>
		</view>
		<view class="tip">
			提示：我的界面中的兑换记录选项可以查看历史兑换记录和兑换码哦！或者你可以直接 <text @click="exchangeRecords" class="go">点击前往</text>
		</view>
		<!-- 支撑顶部高度 -->
		<view style="height: 160upx;"></view>
		<view class="cove-bom">
			<view class="bottom-box">
				<!-- <view class="cover-quest">
					提交问题
				</view> -->
				<button style="float: left;margin-left: 30rpx;" class="cover-list-btn" open-type="share">
					<view class="cover-list-icon" style="height: 56upx;">
						<image class="ui-img" src="/static/public/fenxiang.svg" mode="aspectFit">
						</image>
					</view>
					<view class="cover-list-font">分享物品</view>
				</button>
				<view style="width: 450rpx;float: right;margin-right: 30rpx;">
					<view>
						<button open-type="contact" class="kefu">联系客服</button>
					</view>
					<view>
						<view @click="onSkip()" class="duihuan">立刻兑换</view>
					</view>
				</view>
				
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		appGetUserById,
		exchangeGoods
	} from "@/api/app/index.js"
	import config from '@/config'
	export default {
		data() {
			return {
				baseUrl: config.baseUrl,
				goodsImg: "",
				goodsName: "",
				goodsExchange: "",
				isCami: null,
				camiType: null,
				userId: null,
				isHot: 0,
				userid: null
			}
		},
		// 分享好友配置
		onShareAppMessage(res) {
			var that = this;
			if (res.from === 'button') { // 来自页面内分享按钮
			}
			return {
				title: that.goodsName,
				imageUrl: that.goodsImg,
				path:'/pages/tool/exchangeinfo?goodsImg='+that.goodsImg+"&goodsName="+that.goodsName+"&goodsExchange="+that.goodsExchange+"&isHot="+that.isHot,
			}
		},
		onShareTimeline() {
			var that = this;
			return {
				title: that.goodsName,
				query: {
					goodsImg: that.goodsImg,
					goodsName: that.goodsName,
					goodsExchange: that.goodsExchange,
					isHot: that.isHot
				},
				imageUrl: that.goodsImg
			}
		},
		onLoad(val) {
			this.userId = uni.getStorageSync("userInfo").userId
			this.goodsImg = val.goodsImg
			this.goodsName = val.goodsName
			this.goodsExchange = val.goodsExchange
			this.isHot = val.isHot
			this.isCami = val.isCami
			this.camiType = val.camiType
			this.userid = uni.getStorageSync("userInfo").userId
		},
		methods: {
			onSkip(e) {
				var that = this
				if (!this.userId) {
					that.$refs.uToast.show({
						type: 'success',
						title: '',
						message: "请先授权登录",
						icon: false
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '确认要消耗 ' + that.goodsExchange + " 积分兑换吗？",
						success: function(res) {
							if (res.confirm) {
								// 执行确认后的操作
								appGetUserById(that.userId).then(response => {
									if (that.goodsExchange > response.user.integral) {
										uni.showModal({
										        title: '积分不足',
										        content: '您的积分为 '+response.user.integral+' ,签到做任务可获得积分',
										        cancelText: "取消",
										        confirmText: "获取积分",
										        confirmColor:'#ff0000',
										        cancelColor:'#000000',
										        success: function(res) {
										        if (res.confirm) {
										            // 执行确认后的操作
													uni.switchTab({
														url: '/pages/mine/index'
													});
										        } 
										        else {
										            // 执行取消后的操作
										        }
										    }
										})
									} else {
										var data = {
											goodsName: that.goodsName,
											recordsUserId: that.userId,
											recordsNumber: that.goodsExchange,
											isCami:that.isCami,
											camiType:that.camiType
										}
										exchangeGoods(data).then(response => {
											uni.showModal({
											        title: '兑换成功',
											        content: '兑换码：'+response.msg,
											        success: function(res) {
											        if (res.confirm) {
											           
											        } 
											        else {
											            // 执行取消后的操作
											        }
											    }
											})
										})
									}
			
			
								})
							} else {
								// 执行取消后的操作
							}
						}
					})
				}
			
			},
			exchangeRecords() {
				var that = this
				if (!this.userid) {
					that.$refs.uToast.show({
						type: 'success',
						title: '',
						message: "请先授权登录",
						icon: false
					})
				} else {
					this.$tab.navigateTo('/pages/mine/exchange_records')
				}
			},
		}
	}
</script>
<style scoped lang="scss">
	$base: #fe3b0f; // 基础颜色
	$assist-clor: #ff4e17; // 辅助颜色
	$change-clor: #fc603a; // 渐变色
	$floor-clor: #fafafa; // 底部颜色
	$price-clor: #ff0000; // 价格颜色

	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #ffffff;
		min-height: 100%;
		height: auto;
	}

	.kefu {
		height: 90rpx;
		width: 225rpx;
		background: linear-gradient(to right, #F7CA39, #F8972E);
		text-align: center;
		line-height: 90rpx;
		font-size: 36rpx;
		color: white;
		border-radius: 7px 0 0 7px;
		float: left;
	}
	.duihuan{
		height: 90rpx;
		width: 225rpx;
		background: linear-gradient(to right, #F87628, #FA531F);
		text-align: center;
		line-height: 90rpx;
		font-size: 36rpx;
		color: white;
		float: left;
		border-top-right-radius: 7px;
		border-bottom-right-radius: 7px;
	}
	.bottom-box{
		padding: 30rpx 0;
		height: 156rpx;
	}

	.tip {
		font-size: 30rpx;
		margin: 20rpx;
		color: #888;
		text-align: center;
	}

	.go {
		color: #0055ff;
		text-decoration: underline;
		margin-left: 20rpx;
	}

	.buzou {
		width: 300rpx;
		font-size: 30rpx;
		padding: 20rpx;
		color: #888;
	}

	.ui-img {
		height: 100%;
		width: 100%;
	}

	.cover-list-icon {
		height: 54upx;
		width: 54upx;
		display: block;
		margin: auto;
	}

	.cover-list-btn {
		margin: 0upx;
		padding: 0upx;
		background-color: unset;
		line-height: unset;
	}

	button::after {
		border: none;
	}

	.cover-list-font {
		color: #b2b2b2;
		font-size: 24upx;
		text-align: center;
		/* margin-top: 16upx; */
	}

	.cover-open-right-bot {
		width: 100%;
		height: 100%;
		transform: rotate(180deg);
	}

	.cover-open-right-up {
		width: 100%;
		height: 100%;
	}

	.cover-open-right {
		position: absolute;
		right: 44upx;
		height: 32upx;
		width: 32upx;
	}

	.cover-quest {
		border-radius: 100upx;
		height: 74upx;
		line-height: 74upx;
		width: 24%;
		background-color: #f3f3f3;
		color: #b7b7b7;
		font-size: 24upx;
		padding-left: 40upx;
		margin-top: 20rpx;
	}

	.cover-list-view {
		margin-bottom: 20upx;
		margin-top: 20rpx;
		height: 110upx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		overflow: hidden;
	}

	.cover-h-icon {
		height: 50upx;
		width: 50upx;
		overflow: hidden;
		margin-left: 28upx;
		margin-right: 14upx;
	}

	.cover-view-h {
		margin: 28upx 28upx 0upx 28upx;
		color: #FFFFFF;
		height: 80upx;
		font-size: 28upx;
		display: flex;
		align-items: center;

	}

	.cove-bom {
		position: fixed;
		bottom: 0upx;
		left: 0upx;
		width: 100%;
		z-index: 1025;
		background-color: #fff;
	}

	.goods-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.list {
			width: 100%;
			margin-bottom: 20rpx;
			background-color: #ffffff;
			border-radius: 10rpx;
			overflow: hidden;

			.pictrue {
				display: flex;
				justify-content: center;

				image {
					height: 500rpx;
					width: 98%;
				}
			}

			.title-tag {
				// display: flex;
				height: 100rpx;
				padding: 0rpx 20rpx 20rpx 20rpx;

				.tag {
					float: left;
					margin-right: 10rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					white-space: normal;
					font-size: 32rpx;
					line-height: 40rpx;

					text {
						font-size: 28rpx;
						color: #ffffff;
						padding: 4rpx 16rpx;
						background: linear-gradient(to right, $base, $change-clor);
						border-radius: 10rpx;
						margin-right: 10rpx;
					}
				}
			}

			.price-info {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				justify-content: space-between;
				padding: 0 20rpx;
				margin-top: 10rpx;
				height: 85rpx;

				.user-price {
					display: flex;
					align-items: center;

					text {
						color: $price-clor;
					}

					.min {
						font-size: 32rpx;
					}

					.max {
						font-size: 35rpx;
						margin-left: 10rpx;
					}
				}

				.vip-price {
					display: flex;
					align-items: center;

					image {
						width: 26rpx;
						height: 26rpx;
						margin-right: 10rpx;
					}

					text {
						color: #fcb735;
						font-size: 24rpx;
					}
				}
			}
		}
	}
</style>