<template>
	<view>
		<view :style="{ height: imgStyle.height,width: imgStyle.width}" :class="[ type ==1 ? '':'computer']" class="img_box">
			<image v-if="type == 1" style="width: 100%; height: 100%;" :src="baseUrl+zipUrl"></image>
			<image v-else style="width: 100%;top: 35%;" :src="baseUrl+zipUrl"></image>
		</view>
		<view v-if="share == 0" @click="back()" class="back"><text class="cuIcon-back_android back_img"></text></view>
		<view v-else @click="home()" class="back"><text class="cuIcon-home back_img_home"></text></view>
		<view :style="{'visibility': (type == 1 ? '':'hidden')}"  class="time_img">
			23:56
		</view>
		<view  :style="{'visibility': (type == 1 ? '':'hidden')}" class="time_day">
			05 月 23 日
		</view>
		<view :style="{top: sysHeight}" class="menu_img">
			<view style="height: 140rpx;" class="flex justify-center">
				<button @click="zan()" class="down_box_but">
					<text class="cuIcon-likefill down_ico"></text>
					<text style="display: block;" class="down_text">点赞</text>
				</button>
				<view @click="downImg()" class="down_box_down">
					<text style="font-size: 85rpx;font-weight: 900" class="cuIcon-down down_ico"></text>
				</view>
				<button open-type="share" class="down_box_but">
					<text class="cuIcon-forwardfill down_ico"></text>
					<text style="display: block;" class="down_text">分享</text>
				</button>
			</view>
		</view>
		<!--广告确认弹窗-->
		<view class="cu-modal" :class="modalName=='adModal'?'show':''">
			<view style="border-radius: 30rpx;" class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view style="color: black;font-size: 38rpx;margin-top: 50rpx;" class="content">高清原图下载</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class=" bg-white">
					<view style="font-size: 33rpx;color: #6a6a6a;padding: 40rpx 60rpx 60rpx 60rpx;">
						看完 <text style="color: #3C9CFF;margin: 0 10rpx;">视频广告</text> 之后自动下载超清原图,存储与传输成本很高不得已部分资源加入广告回回血
					</view>
		
					<button @tap="nowDownImg" style="margin-bottom: 50rpx;width: 55%;height: 90rpx;font-size: 38rpx;"
						class="cu-btn bg-blue"><text style="margin-right: 20rpx;font-size: 50rpx;" class="cuIcon-recordfill"></text> 现在下载</button>
				</view>
			</view>
		</view>
		<!--提示保存到相册-->
		<view class="cu-modal" :class="modalName=='yesModal'?'show':''">
			<view style="border-radius: 30rpx;" class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view style="color: black;font-size: 38rpx;margin-top: 50rpx;" class="content">提示</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class=" bg-white">
					<view style="font-size: 33rpx;color: #6a6a6a;padding: 40rpx 60rpx 60rpx 60rpx;">
						超清原图已保存至您的手机相册
					</view>
		
					<button @tap="hideModal" style="margin-bottom: 50rpx;width: 55%;height: 90rpx;font-size: 38rpx;"
						class="cu-btn bg-blue">知道了</button>
				</view>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	let videoAd = null;
	import {
		imgDownLoad
	} from "@/api/app/index.js"
	import config from '@/config'
	export default {
		data() {
			return {
				baseUrl: config.baseUrl,
				adUnitId: "",
				id: null,
				imgUrl: "",
				zipUrl: "",
				isAd: 0,
				type: 0,
				share:0,
				imgStyle: {
					width: uni.getWindowInfo().screenWidth + "px",
					height: uni.getWindowInfo().screenHeight + "px",
				},
				sysHeight: uni.getWindowInfo().screenHeight - 240 + "px",
				modalName: null,
			}
		},
		onShareAppMessage(res) {
			var that = this;
			return {
				title: "壁纸精选",
				imageUrl: that.zipUrl,
				path: 'pages/tool/look_img?zipUrl=' + that.zipUrl + "&url=" + that.imgUrl + "&id=" + that.id + "&isAd=" +
					that.isAd+ "&type=" + that.type+"&share=1",
			}
		},
		onLoad(data) {
			this.adUnitId = uni.getStorageSync("sysSet").downVideoAd
			this.zipUrl = data.zipUrl
			this.imgUrl = data.url
			this.id = data.id
			this.isAd = data.isAd
			this.type = data.type
			// 是否来自分享页面
			if(data.share){
				this.share = data.share
			}
			//初始化激励广告
			this.CreateAd()
		},
		methods: {
			home(){
				uni.switchTab({
					url: '/pages/index'
				});
			},
			downImg() {
				if (this.isAd == 0) {
					this.modalName = "adModal"
				} else {
					this.downloadImg()
				}

			},
			nowDownImg(){
				this.modalName = null
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
								that.downloadImg()
							} else {}
						})
					}

				}
			},
			downloadImg() {
				var that = this;
				uni.getSetting({ //获取用户的当前设置
					success: (res) => {
						if (res.authSetting['scope.writePhotosAlbum']) { //验证用户是否授权可以访问相册
							that.download();
						} else {
							uni.authorize({ //如果没有授权，向用户发起请求
								scope: 'scope.writePhotosAlbum',
								success: () => {
									that.download();
								},
								fail: () => {
									uni.showToast({
										title: "请打开保存相册权限，再点击保存相册分享",
										icon: "none",
										duration: 3000
									});
									setTimeout(() => {
										uni.openSetting({ //调起客户端小程序设置界面,让用户开启访问相册
											success: (res2) => {
												// console.log(res2.authSetting)
											}
										});
									}, 3000);
								}
							})
						}
					}
				})
			},

			download() {
				var that = this;
				uni.showLoading({
					title: '获取中'
				})
				var downloadUrl = ""
				if (this.imgUrl != "" && this.imgUrl != "null") {
					downloadUrl = this.baseUrl+this.imgUrl
				} else {
					downloadUrl = this.baseUrl+this.zipUrl
				}
				downloadUrl = downloadUrl.replace('http://', 'http://')
				uni.downloadFile({
					url: downloadUrl,
					success: (res) => {
						if (res.statusCode === 200) {
							uni.hideLoading()
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									imgDownLoad({
										id: that.id
									}).then(response => {})
									that.modalName = "yesModal"
									setTimeout(() => {
										uni.openSetting({ //调起客户端小程序设置界面,让用户开启访问相册
											success: (res2) => {}
										});
									}, 3000);
								},
								fail: function() {
									uni.showToast({
										title: '保存失败',
										icon: 'error',
										duration: 2000
									});
									setTimeout(() => {
										uni.openSetting({ //调起客户端小程序设置界面,让用户开启访问相册
											success: (res2) => {}
										});
									}, 3000);
								}
							});
						} else {
							uni.showToast({
								title: '获取失败',
								icon: 'error',
								duration: 2000
							});
							setTimeout(() => {
								uni.openSetting({ //调起客户端小程序设置界面,让用户开启访问相册
									success: (res2) => {}
								});
							}, 3000);
						}

					}
				});
			},
			back() {
				uni.navigateBack()
			},
			zan() {
				this.$refs.uToast.show({
					type: 'success',
					title: '',
					message: "╮(๑•́ ₃•̀๑)╭ 谢谢您 ",
					icon: false
				})
			},
			hideModal() {
				this.modalName = null
			}
		}
	}
</script>

<style>
	.computer{
		background-color: #141414;
	}
	.time_img {
		font-size: 120rpx;
		color: #fff;
		position: relative;
		width: 70%;
		left: 15%;
		top: 100rpx;
		text-align: center;
	}

	.time_day {
		font-size: 40rpx;
		color: #fff;
		position: relative;
		width: 70%;
		left: 15%;
		top: 110rpx;
		text-align: center;
		font-weight: 400;
	}

	.down_ico {
		font-size: 60rpx;
		color: white;
		opacity: 1 !important;
	}

	.down_text {
		font-size: 28rpx;
		color: #c3c3c3;
		font-weight: 600
	}

	.down_box_but {
		margin: 10rpx 30rpx;
		background-color: rgba(0, 0, 0, 0);
		text-align: center;
		height: 100rpx;
		line-height: 40rpx;
		padding-top: 15rpx;
	}

	button::after {
		border: none;
	}

	.down_box_down {
		margin: 10rpx;
		background-color: #4C4C4C;
		width: 140rpx;
		height: 140rpx;
		line-height: 140rpx;
		text-align: center;
		border-radius: 100rpx;
		margin-top: -40rpx;
	}

	.img_box {
		position: absolute;
	}

	.back {
		position: relative;
		width: 75rpx;
		height: 75rpx;
		background-color: rgba(0, 0, 0, 0.4);
		text-align: center;
		line-height: 75rpx;
		border-radius: 80rpx;
		top: 100rpx;
		left: 40rpx;
	}

	.back_img {
		color: white;
		font-size: 57rpx;
		opacity: 1 !important;
		font-weight: 900;
	}
	.back_img_home{
		color: white;
		font-size: 50rpx;
		opacity: 1 !important;
		font-weight: 600;
	}

	.menu_img {
		position: relative;
		background-color: rgba(0, 0, 0, 0.4);
		width: 70%;
		height: 120rpx;
		left: 15%;
		border-radius: 100rpx;

	}
</style>