<template>
	<view class="content">
		<view class="remove">
			<view class="remove-title-clearButton">
				<view class="remove-title">
					<view class="remove-title-content">
						<u--text bold size="18" color="#0081ff" text="快速去水印"></u--text>
					</view>
					<view class="remove-title-shadow">
						<u--text bold color="#0081ff" text="SPEEDY"></u--text>
					</view>
				</view>
				<view class="remove-clearButton">
					<u--text @click="clearTextarea" text="清空"></u--text>
				</view>
			</view>
			<view class="remove-textarea">
				<u--textarea maxlength="180" border="none" height="140" v-model="input_url"
					placeholder="请粘贴需要提取的视频/图集链接,支持抖音,快手,小红书,哔哩哔哩等 100+ 平台"></u--textarea>
			</view>
			<view class="remove-paste-submit-button">
				<view class="remove-paste-button">
					<u-button @click="pasteURL" type="primary" plain text="粘贴链接"></u-button>
				</view>
				<view class="remove-submit-button">
					<u-button @click="getAnalysisDate" type="primary" text="立即解析"></u-button>
				</view>
			</view>
			<view style="margin-top: 20rpx;" class="remove-question">
				<view class="remove-question-black">
					<u--text text="觉得好用点击右上角 “···” 分享给你的朋友吧!"></u--text>
				</view>
			
			</view>
			<view class="remove-question">
				<view class="remove-question-black">
					<u--text text="有问题？请看"></u--text>
				</view>
				<view class="remove-question-blue">
					<u--text decoration="underline" @click="jumpPage('/pages/tool/shuiyin/problem')" type="primary"
						text="教程和问题"></u--text>
				</view>

			</view>
		</view>
		<view v-if="adUnitId" style="width: 96%; margin-top: 30rpx;margin-left: 2%;">
			<ad-custom :unit-id="adUnitId"  ad-intervals="30" ></ad-custom>
		</view>
		<!--广告确认弹窗-->
		<view class="cu-modal" :class="modalName=='adModal'?'show':''">
			<view style="border-radius: 30rpx;" class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view style="color: black;font-size: 38rpx;margin-top: 40rpx;" class="content">水印去除</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class=" bg-white">
					<view style="font-size: 33rpx;color: #6a6a6a;padding: 30rpx 60rpx 60rpx 60rpx;">
						消耗 <text style="color: #3C9CFF;margin: 0 10rpx;">积分</text> 或者看 <text
							style="color: #3C9CFF;margin: 0 10rpx;">视频广告</text> 之后自动获取,存储与传输成本很高不得已加入广告回回血
					</view>

					<button @tap="nowDownJf" style="margin-bottom: 30rpx;width: 35%;height: 70rpx;font-size: 30rpx;"
						class="cu-btn bg-blue"><text style="margin-right: 15rpx;font-size: 30rpx;"
							class="cuIcon-vip"></text> 消耗积分</button>
					<button @tap="nowDownImg" style="margin-bottom: 40rpx;width: 35%;height: 70rpx;font-size: 30rpx;margin-left: 50rpx;"
						class="cu-btn bg-blue"><text style="margin-right: 15rpx;font-size: 30rpx;"
							class="cuIcon-recordfill"></text> 观看广告</button>
				</view>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	let videoAd = null;
	import {
		delShuiYin,appGetUserById,exchangeResource,getConfigKey
	} from "@/api/app/index.js"
	export default {
		data() {
			return {
				adUnitId: "",
				adUnitId2: "",
				isOpenAd: false,
				videoAd_id: "",
				interstitialAd_id: "",
				input_url: "",
				tabbarIndex: 1,
				modalName: null,
				needJf:6,
				userId: null,
			}
		},
		onShareAppMessage() {
		    return {
		    	title: "图片视频水印快速去除，支持抖音，快手等100+平台",
		    	imageUrl: "/static/appimg/share/shuiyin.jpg",
		    	path: 'pages/tool/shuiyin',
		    }
		},
		onShareTimeline(){
		    return {
		      title:'图片视频水印快速去除，支持抖音，快手等100+平台',
		      query:{
		      },
		      imageUrl:'/static/appimg/share/shuiyin.jpg'
		    }
		},
		onLoad() {
			this.adUnitId = uni.getStorageSync("sysSet").zyinfoAd
			this.adUnitId2 = uni.getStorageSync("sysSet").downVideoAd
			let _this = this;
			this.userId = uni.getStorageSync("userInfo").userId
			//获取公告
			getConfigKey("miniapp.shuiyin.delintegral").then(response => {
				_this.needJf = response.msg
			}),
			//初始化激励广告
			this.CreateAd()
			
		},
		onShow() {
			let _this = this;
		},
		methods: {
			nowDownJf() {
				let that = this;
				this.modalName = null
				uni.showModal({
					title: '提示',
					content: '确认要消耗 ' + that.needJf + " 积分兑换吗？",
					success: function(res) {
						if (res.confirm) {
							// 执行确认后的操作
							appGetUserById(that.userId).then(response => {
								if (that.needJf > response.user.integral) {
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
									var formData = {
										source: '视频/图片水印解析',
										isAdd: 1,
										integralNumber: that.needJf,
										userId: that.userId,
									}
									exchangeResource(formData).then(response => {
										that.openYse()
									})
								}
							})
						} else {
							// 执行取消后的操作
							
						}
					}
				})
			},
			hideModal() {
				this.modalName = null
			},
			nowDownImg() {
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
			CreateAd() {
				var that = this;
				if (this.adUnitId2 != '') {
					if (wx.createRewardedVideoAd) {
						videoAd = wx.createRewardedVideoAd({
							adUnitId: this.adUnitId2
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
								this.modalName = null
								that.openYse()
							} else {
								this.modalName = null
								//that.openYse()
							}
						})
					}

				}
			},
			getStrUrl(s) {
				var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
				var reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
				s = s.match(reg);
				return (s && s.length ? s[0] : null);
			},
			openYse() {

				let _this = this;
				uni.showLoading({
					title: '解析中...',
					mask: true
				});
				let getUrl = _this.getStrUrl(_this.input_url)
				delShuiYin({
					url: getUrl
				}).then(response => {
					var dataMsg = JSON.parse(response.msg)
					uni.hideLoading()
					if (dataMsg.code != 200) {
						uni.showModal({
						        title: '提示',
						        content: dataMsg.msg,
								showCancel: false,
						       	confirmText: "确定",
						        success: function(res) {
						        if (res.confirm) {
						            // 执行确认后的操作
						        } 
						        else {
						            // 执行取消后的操作
						        }
						    }
						})
					} else {
						var antoInfo = dataMsg.data.data_info
						if (antoInfo.code != 200) {
							uni.showToast({
								title: antoInfo.msg,
								icon: 'none',
								duration: 4000
							});
						}else{
							uni.setStorageSync("analysisData", antoInfo)
							_this.input_url = ''
							if (antoInfo.pics == "") {
								_this.jumpPage("/pages/tool/shuiyin/video")
							} else {
								_this.jumpPage("/pages/tool/shuiyin/image")
							}
						}
						
					}

				})
			},
			getAnalysisDate() {
				let _this = this;
				if (_this.input_url == "" || _this.input_url == null) {
					uni.showToast({
						title: '请填写内容后解析哦！',
						icon: 'none',
						duration: 2000
					});
				} else {
					let getUrl = _this.getStrUrl(_this.input_url)
					if (getUrl == null) {
						uni.showToast({
							title: '糟糕！您填写的内容找不到解析地址，无法解析！',
							icon: 'none',
							duration: 2000
						});
						_this.input_url = ''
						return;
					}
					_this.modalName = 'adModal'
				}
			},
			pasteURL() {
				let _this = this;
				uni.getClipboardData({
					success: function(res) {
						// console.log(res.data)
						_this.input_url = res.data
					},
					fail(e) {
						console.log(e)
					}
				})
			},
			clearTextarea() {
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '确定要清空当前输入框吗？',
					success: res => {
						if (res.confirm) {
							_this.input_url = ""
						}
					}
				})
			},
			jumpPage(url) {
				this.$tab.navigateTo(url)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $u-bg-color;
	}

	.remove {
		padding: 20rpx 20rpx 20rpx 20rpx;
	}

	.remove-title-clearButton {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.remove-textarea {
		margin-top: 30rpx;
		border-radius: 25rpx;
		background-color: #f8f8f8;
		box-shadow: 0px 5px 5px 0px #EDEDED;
	}

	.remove-clearButton {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

	}

	.remove-title {
		position: relative;
	}

	.remove-title-shadow {
		position: absolute;
		bottom: -20rpx;
		font-style: italic;
		opacity: 0.4;
		padding-left: 10rpx;
	}

	.u-textarea[data-v-09988a29] {
		border-radius: 12px;
		background-color: #fff;
		position: relative;
		display: flex;
		flex-direction: row;
		flex: 1;
		padding: 9px;
	}

	.remove-paste-submit-button {
		padding-top: 35rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.remove-paste-button,
	.remove-submit-button {
		width: 45%;
		box-shadow: 3px 3px 4px rgba(0, 102, 204, 0.2);
	}

	.remove-question {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding-top: 10rpx;
	}

	.remove-question-black {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding-right: 10rpx;
	}

	.remove-question-blue {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.ad-show {
		width: 100%;
		padding-top: 30rpx;
	}
</style>