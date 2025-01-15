<template>
	
	<view class="">
		    <view class="custom-navbar">
		      <text style="font-size: 40rpx;" @click="back()" class="cuIcon-back"></text>
		      <view class="title">幸运大抽奖</view>
		      <view class="back-button">
		      </view>
		    </view>
		<choujian style="position: absolute;" ref='choujian' :nImg='nImg' :AwardList="AwardList" :sjNum="sjNum"
			:lotteryType="lotteryType" @updateMoney="updateMoney" @lookAd="lookAd" @noChance="noChance">
		</choujian>
		<view class="tip-box">100%中奖，积分中不停</view>
		<view class="log-box">
			<!-- 通知 -->
			<view class="inform">
				<view class="inform-info">
					<view class="info">
						<swiper class="swiper" :circular="true" :vertical="true" :indicator-dots="false"
							:autoplay="true" :interval="3000" :duration="1000">
							<swiper-item v-for="(item,index) in lotteryLog" :key="index">
								<view class="swiper-item"><text class="one-omit">
										<text class="cuIcon-vip"
											style="margin-right: 10rpx;font-size: 23rpx;color: #fcc600;"></text>
										微信用户_{{item.lotteryUserId}} 抽中了 {{item.name}}</text>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view style="border-radius: 30rpx;" class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view style="color: black;font-size: 38rpx;margin-top: 50rpx;" class="content">提示</view>
				</view>
				<view class=" bg-white">
					<view style="font-size: 35rpx;color: #6a6a6a;padding: 40rpx 60rpx 60rpx 60rpx;">
						{{lotteryMsg}}
					</view>

					<button @tap="hideModal" style="margin-bottom: 50rpx;width: 55%;height: 90rpx;font-size: 38rpx;"
						class="cu-btn bg-green">知道了</button>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='nowLookAd'?'show':''">
			<view style="border-radius: 30rpx;" class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view style="color: black;font-size: 38rpx;margin-top: 50rpx;" class="content">提示</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class=" bg-white">
					<view style="font-size: 35rpx;color: #6a6a6a;padding: 40rpx 60rpx 60rpx 60rpx;">
						今日免费抽奖次数已用完，观看视频后可额外获得一次抽奖机会哟
					</view>

					<button @tap="nowLookAd" style="margin-bottom: 50rpx;width: 55%;height: 90rpx;font-size: 38rpx;"
						class="cu-btn bg-green">观看视频</button>
				</view>
			</view>
		</view>
		<view class="bottom-guard"></view>
	</view>
</template>

<script>
	import {
		lottery,
		lotteryAdd,
		listLottery,
		listLotteryLog
	} from "@/api/app/index.js"
	import config from '@/config'
	import Choujian from '@/components/gb-choujiang/gb-choujiang';
	let videoAd = null;
	export default {
		components: {
			Choujian
		},
		data() {
			return {
				adUnitId: "",
				baseUrl: config.baseUrl,
				modalName: "",
				userid: null,
				// 背景图，可网络地址，可本地
				nImg: 'http://imgs.emoboy.vip/static/lottery/luck.png',
				// 中奖的索引，也就是AwardList数组的索引，sjNum不能等于4，4是立即抽奖
				sjNum: 0,
				// false前端，true前端
				isQd: true,
				// 可自己后端获取，也可以后端  percentage为概率 10代表10%   100代表100%   注意：必须要有一个概率为100%，
				AwardList: [],
				lotteryType: 0,
				lotteryMsg: "",
				index: -1,
				queryParams: {
					pageNum: 1,
					pageSize: 6,
				},
				lotteryLog: []
			}
		},
		onLoad() {
			var that = this
			this.adUnitId = uni.getStorageSync("sysSet").phoneAd
			//初始化激励广告
			this.CreateAd()
			this.userid = uni.getStorageSync("userInfo").userId
			listLottery().then(response => {
				for (var i = 0; i < response.rows.length; i++) {
					response.rows[i].image = that.baseUrl + response.rows[i].image
				}
				that.AwardList = response.rows
			})
			listLotteryLog(this.queryParams).then(response => {
				that.lotteryLog = response.rows
			})
			this.getData()
		},
		methods: {
			// 中奖后的逻辑
			updateMoney(money) {
				var that = this
				lotteryAdd({
					source: '抽奖',
					userId: this.userid,
					isAdd: 0,
					integralNumber: that.AwardList[money].reward,
					fId: that.AwardList[money].id
				}).then(response => {
					that.lotteryMsg = "恭喜获得：" + that.AwardList[money].name
					setTimeout(() => {
						that.modalName = "Modal"
					}, 500);

					// 中奖后获取最新状态
					that.getData()
				})



			},
			lookAd(index) {
				// this.$refs.choujian.nowBegin(index);
				this.index = index
				this.modalName = 'nowLookAd'
			},
			nowLookAd() {
				this.modalName = ''
				if (videoAd) {
					videoAd.show().catch(() => {
						// 失败重试
						videoAd.load()
							.then(() => videoAd.show())
							.catch(err => {
								console.error('激励视频 广告显示失败', err)
							})
					})
				}
			},
			noChance() {
				this.lotteryMsg = "今日抽奖次数已用完，请明日再来 !"
				this.modalName = "Modal"
			},
			hideModal() {
				this.modalName = null
			},
			// 获取本次中奖的
			getData() {
				var that = this
				// 概率指定，如果是前端控制，如果后端控制下面步骤判断步骤可以省略  直接后端获取sjNum值即可
				if (this.isQd) {
					// ------------------------------这里写获取后端中奖索引
					// 后端赋值控制概率
					lottery({}).then(response => {
						that.lotteryType = response.lotteryType
						that.sjNum = response.sjNum
						console.log("后端随机数: ", response.sj);
						console.log("后端中奖索引: ", response.sjNum);

					})
				} else {
					// 概率控制  概率100%
					console.log(Math.random())
					let sj = Math.round(Math.random() * 99 + 1)
				}
			},
			back() {
				uni.navigateBack()
			},
			CreateAd() {
				var that = this;
				if (this.adUnitId != '') {
					if (wx.createRewardedVideoAd) {
						videoAd = wx.createRewardedVideoAd({
							adUnitId: this.adUnitId
						})
						videoAd.onLoad(() => {})
						videoAd.onError((err) => {
							that.$refs.uToast.show({
								type: 'error',
								title: '',
								message: "请使用移动端设备访问",
								icon: false
							})
						})
						videoAd.onClose((res) => {
							if (res && res.isEnded) {
								// that.$refs.uToast.show({
								// 	type: 'success',
								// 	title: '',
								// 	message: "╮(๑•́ ₃•̀๑)╭ 谢谢您的支持 ",
								// 	icon: false
								// })
								that.$refs.choujian.nowBegin(that.index);
							} else {}
						})
					}

				}
			}

		}
	}
</script>

<style scoped lang="scss">
	.tip-box {
		position: relative;
		background: linear-gradient(to right, #FE1C62, #FC8524);
		height: 55rpx;
		width: 70%;
		left: 15%;
		top: 235rpx;
		text-align: center;
		line-height: 55rpx;
		color: #fff;
		font-weight: 600;
		border-radius: 15rpx;
		letter-spacing: 10rpx;
		box-shadow:
			0 -2px 2px rgba(255, 255, 255, 0.4),
			/* 上阴影 */
			0 2px 2px rgba(255, 255, 255, 0.4),
			/* 下阴影 */
			2px 0 2px rgba(255, 255, 255, 0.4),
			/* 左阴影 */
			-2px 0 2px rgba(255, 255, 255, 0.4);
		/* 右阴影 */
	}

	.log-box {
		position: relative;
		height: 65rpx;
		width: 56%;
		left: 22%;
		top: 1150rpx;
	}

	/* 通知 */
	.inform {

		.inform-info {
			display: flex;
			padding: 0 20rpx;
			height: 65rpx;
			background-color: rgba(0, 0, 0, 0.1);
			border-radius: 50rpx;

			.picture {
				width: 20%;
				height: 100%;

				image {
					width: 93rpx;
					height: 84rpx;
					margin-top: -20rpx;
				}
			}

			.info {
				width: 100%;
				height: 100%;

				.swiper {
					width: 100%;
					height: 100%;

					.swiper-item {
						line-height: 65rpx;
						text-align: center;
						width: 100%;
						height: 100%;

						text {
							font-size: 24rpx;
							color: #ffffff;
						}
					}
				}
			}
		}
	}
	.custom-navbar {
	  /* 自定义导航栏样式 */
	  display: flex;
	  align-items: center;
	  padding: 60px 10px 10px 10px;
	  background-color: #F118E3;
	  color: #FFFFFF;
	}
	.title {
	  flex: 1;
	  text-align: center;
	}
	.back-button {
	  padding: 10px;
	}
	page {
		background-color: #1015F2;
		--safe-area-inset-bottom: env(safe-area-inset-bottom); /* 设置底部安全区域 */
	}
	page {
	}
	 
	.bottom-guard {
	  height: calc(var(--safe-area-inset-bottom)); /* 假设你需要的底部保护区域高度是100px */
	  background-color: #1015F2; /* 设置你想要的颜色 */
	  position: fixed;
	  left: 0;
	  right: 0;
	  bottom: 0;
	}
</style>