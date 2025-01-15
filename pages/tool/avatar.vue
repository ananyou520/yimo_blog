<template>
	<view>
		<view class="notice-box">
			<image class="notice-svg" src="/static/index/notice2.png" mode=""></image>
			<view class="notice-text">
				<p>壁纸图片素材据来自作者在他者处购买和互联网收集，如有问题或侵权请您在 我的-->客服 联系我们删除，谢谢！！！</p>
			</view>
		</view>
		<view>
			<image class="container" src="/static/search/xinkong.gif">
				<view class="container-h">
					悬悬而望
				</view>
				<view class="container-slog">
					愿我们都不后悔，出现在彼此的世界中
				</view>
				<view class="container-search">
					<uni-search-bar v-model="searchValue" style="opacity: 0.9;" radius="190" placeholder="搜索一下，爱上这个世界"
						@confirm="search" cancelButton="none" bgColor="#fff" />
				</view>
			</image>
		</view>
		<view class='padding-sm flex flex-wrap'>
			<view @click="searchType(item.typeVal)" class="padding-xs" v-for="(item,index) in TypeList" :key="index">
				<view class='cu-tag round light' :class="'bg-' + item.name">{{item.title}}</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-orange "></text> 头像列表
			</view>
		</view>
		<view class="shuoming">为加速页面展示图片经过压缩处理，想要高清无损图请您下载！</view>
		<view v-if="dataList.length != 0" class="bg-white" style="padding: 25rpx;">
			<view class="grid margin-bottom col-2">
				<view  @click="dowm(item)" v-for="(item,index) in dataList" :key="index" class="grid-box">
					<view style="width: 337rpx;height: 337rpx;background-color: white;overflow: hidden;" v-if="item.ad == 1">
						<ad-custom style="height: 337rpx !important;" :unit-id="adUnitId" ad-intervals="30" ></ad-custom>
					</view>
					<view v-else>
						<image class="grid-img" :src="baseUrl+item.compressImgUrl"></image>
						<view class="info-img">
							<view class="flex justify-between">
								<view v-if="item.isAd != 0" class="img-type"><text class="cuIcon-rechargefill"></text> 免费获取
								</view>
								<view v-else class="img-type"><text class="cuIcon-rechargefill"></text> 广告获取</view>
								<view class="img-down-number"><text class="cuIcon-likefill"></text>{{item.downNum}} 次下载
								</view>
							</view>
						</view>
					</view>
					
					<!-- <view @click="downloadImg(item)" v-if="item.isAd != 0" class="notad">免费下载</view>
					<view @click="lookAd(item)" v-else class="ad">看广告下载</view> -->
				</view>
			</view>
		</view>
		<view style="text-align: center;" v-else>
			<image style="width: 400rpx;height: 200rpx;" src="/static/public/nodata.svg"></image>
			<view style="color: #adadad;">无数据</view>
		</view>
		<!-- 加载动图 -->
		<view class="artileload" v-if="showTotal">
			<image style="width: 100%;height: 100%;" src="/static/public/articleload.gif"
				mode="aspectFit"></image>
		</view>
		<!-- 文章列表没有数据 -->
		<view class="no-list-data" v-else>
			--我的底线就到这里了--
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
	import {
		listWallpaper,
		getDicts,
		imgDownLoad
	} from "@/api/app/index.js"
	import config from '@/config'
	let videoAd = null;
	export default {
		data() {
			return {
				baseUrl: config.baseUrl,
				adUnitId: "",
				ColorList: [{
						name: 'red',
						color: '#e54d42'
					},
					{
						name: 'orange',
						color: '#f37b1d'
					},
					{
						name: 'yellow',
						color: '#fbbd08'
					},
					{
						name: 'olive',
						color: '#8dc63f'
					},
					{
						name: 'green',
						color: '#39b54a'
					},
					{
						name: 'cyan',
						color: '#1cbbb4'
					},
					{
						name: 'blue',
						color: '#0081ff'
					},
					{
						name: 'purple',
						color: '#6739b6'
					},
					{
						name: 'mauve',
						color: '#9c26b0'
					},
					{
						name: 'pink',
						color: '#e03997'
					},
					{
						name: 'brown',
						color: '#a5673f'
					},
					{
						name: 'grey',
						color: '#8799a3'
					},
					{
						name: 'gray',
						color: '#aaaaaa'
					},
					{
						name: 'black',
						color: '#333333'
					},
					{
						name: 'white',
						color: '#ffffff'
					},
				],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isShow: 1,
					wallpaperType: 3
				},
				TypeList: [],
				dataList: [],
				total: 0,
				showTotal: false,
				searchValue: null,
				thisObject: null,
				modalName: null,
				platform: 0
			}
		},
		onLoad() {
			this.adUnitId = uni.getStorageSync("sysSet").phoneAd
			//获取文章列表
			this.getWallpaperList()
			//初始化激励广告
			this.CreateAd()
			//获取文章类型标签
			getDicts("app_avatar_label").then(response => {
				this.TypeList = [];
				var randomNumber = this.getRandomNumber(0, 14, response.data.length)
				for (var i = 0; i < response.data.length; i++) {
					var type = {
						title: response.data[i].dictLabel,
						name: this.ColorList[randomNumber[i]].name,
						color: this.ColorList[randomNumber[i]].color,
						typeVal: response.data[i].dictLabel
					}
					this.TypeList.push(type)
				}
			})
			wx.getSystemInfo({
				success: (res) => {
					//ios android
					if (res.platform == 'mac' || res.platform == 'windows') {
						this.platform = 1
					}
				}
			})

		},
		// 下拉刷新
		onPullDownRefresh() {
			this.queryParams = {
				pageNum: 1,
				pageSize: 10,
				isShow: 1,
				keyword: null,
				wallpaperType: 3
			}
			this.searchValue = null
			this.getWallpaperList()
		},
		// 上拉分页
		onReachBottom() {
			var that = this;
			var allTotal = this.queryParams.pageNum * this.queryParams.pageSize
			//this.page为加载次数，this.pageSize为每一次加载的数据条数
			if (allTotal < this.total) {
				//this.total为请求数据的总条数。只要现有条数小于总条数就执行一下代码
				this.showTotal = true;
				this.queryParams.pageNum++;
				//加载次数递加
				//请求更多数据列表
				listWallpaper(this.queryParams).then(response => {
					if(that.platform == 0 && that.adUnitId){
						that.dataList.push({ad:1})
					}
					that.dataList = that.dataList.concat(response.rows)
					var allTotal2 = this.queryParams.pageNum * this.queryParams.pageSize
					if (allTotal2 < this.total) {
						//this.total为请求数据的总条数。只要现有条数小于总条数就执行一下代码
						this.showTotal = true;
					} else {
						this.showTotal = false;
					}

				})
			} else {
				this.showTotal = false;
			}
		},
		methods: {
			dowm(itme){
				if(itme.isAd != 0){
					this.downloadImg(itme)
				}else{
					this.lookAd(itme)
				}
			},
			hideModal() {
				this.modalName = null
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
								that.downloadImg(that.thisObject)
							} else {

							}
						})
					}

				}
			},
			lookAd(itme) {
				this.thisObject = itme
				// 用户触发广告后，显示激励视频广告
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
			downloadImg(url) {
				var that = this;
				uni.getSetting({ //获取用户的当前设置
					success: (res) => {
						if (res.authSetting['scope.writePhotosAlbum']) { //验证用户是否授权可以访问相册
							that.download(url);
						} else {
							uni.authorize({ //如果没有授权，向用户发起请求
								scope: 'scope.writePhotosAlbum',
								success: () => {
									that.download(url);
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

			download(url) {
				var that = this;
				uni.showLoading({
					title: '获取中'
				})
				var downloadUrl = "";
				if (url.imgUrl) {
					downloadUrl = this.baseUrl+url.imgUrl
				} else {
					downloadUrl = this.baseUrl+url.compressImgUrl
				}
				downloadUrl = downloadUrl.replace('http://', 'http://')
				uni.downloadFile({
					url: downloadUrl,
					success: (res) => {
						if (res.statusCode === 200) {

							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									imgDownLoad({
										id: url.id
									}).then(response => {})
									that.modalName = "yesModal"
									setTimeout(() => {
										uni.openSetting({ //调起客户端小程序设置界面,让用户开启访问相册
											success: (res2) => {
												uni.hideLoading()
											}
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
											success: (res2) => {
												uni.hideLoading()
											}
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
									success: (res2) => {
										uni.hideLoading()
									}
								});
							}, 3000);
						}

					}
				});
			},
			searchType(type) {
				this.queryParams.pageNum = 1
				this.queryParams.keyword = type
				this.searchValue = null
				this.getWallpaperList()
			},
			// 搜索触发
			search(e) {
				var json = e.value;
				this.queryParams.pageNum = 1
				this.queryParams.keyword = json
				this.getWallpaperList()
			},
			getWallpaperList() {
				var that = this;
				listWallpaper(this.queryParams).then(response => {
					that.dataList = response.rows
					var allTotal = this.queryParams.pageNum * this.queryParams.pageSize
					that.total = response.total
					if (allTotal < this.total) {
						this.showTotal = true;
					} else {
						this.showTotal = false;
					}
					if(that.platform == 0 && that.adUnitId){
						that.dataList.splice(3, 0, {ad:1});
					}
					uni.stopPullDownRefresh(); //停止刷新
				})
			},
			getRandomNumber(min, max, count) {
				const randoms = new Set();
				while (randoms.size < count) {
					const random = Math.floor(Math.random() * (max - min + 1)) + min;
					randoms.add(random);
				}
				return [...randoms];
			},
		}
	}
</script>

<style>
	page {
		background-color: white;
	}

	

	.img-down-number {
		color: white;
		margin-right: 20rpx;
	}

	.img-down-number text {
		font-size: 23rpx;
		color: red;
		margin-right: 6rpx;
	}

	.img-type {
		margin-left: 20rpx;
		color: white;
	}

	.img-type text {
		font-size: 23rpx;
		color: #3DB2FF;
		margin-right: 6rpx;
	}

	.shuoming {
		margin: 25rpx 25rpx 0 25rpx;
		font-size: 24rpx;
		background-color: #fff9d7;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		border-radius: 20rpx;
		color: orange;
	}

	.notice-box {
		margin-top: 10rpx;
		margin-left: 40rpx;
	}


	.notice-svg {
		height: 40upx;
		width: 120upx;
		display: inline-block;
		float: left;
		margin-top: -1rpx;
	}

	.notice-text {
		display: inline-block;
		margin-left: 20rpx;
		width: 530upx;
		overflow: hidden;
		white-space: nowrap;
		box-sizing: border-box;
		border-radius: 20rpx;
	}

	.notice-text p {
		display: inline-block;
		padding-left: 100%;
		animation: marquee 15s linear infinite;
	}

	@keyframes marquee {
		0% {
			transform: translateX(0);
		}

		100% {
			transform: translateX(-100%);
		}
	}

	.ad {
		border: 1px solid #8FDDBB;
		padding: 10rpx;
		border-radius: 10rpx;
		font-size: 20rpx;
		width: 150rpx;
		text-align: center;
		margin-top: 40rpx;
		color: #8FDDBB;
	}

	.notad {
		border: 1px solid #f37b1d;
		padding: 10rpx;
		border-radius: 10rpx;
		font-size: 20rpx;
		width: 150rpx;
		text-align: center;
		margin-top: 40rpx;
		color: #f37b1d;
	}

	.grid-box {
		padding: 7rpx;
		position: relative;
	}

	.grid-img {
		height: 337rpx;
		width: 337rpx;
		border-radius: 15rpx;
	}
	.info-img {
		position: absolute;
		height: 40rpx;
		width: 337rpx;
		border-radius: 0 0 15rpx 15rpx;
		background-color: rgba(0, 0, 0, 0.2);
		bottom: 14rpx;
		line-height: 40rpx;
		font-size: 22rpx;
	
	}

	.container-h {
		color: #FFFFFF;
		font-size: 36upx;
		position: absolute;
		top: 120upx;
		left: 10%;
	}

	.container-slog {
		color: #FFFFFF;
		font-size: 24upx;
		position: absolute;
		top: 190upx;
		left: 10%
	}

	.container-search {
		position: absolute;
		width: 88%;
		top: 250upx;
		left: 6%
	}

	.container {
		margin: 4% 30upx;
		width: 92%;
		height: 320rpx;
		border-radius: 20upx;
		/* padding: 30upx; */
		overflow: hidden;
		position: relative;
	}

	/* 列表没有数据 */
	.no-list-data {
		text-align: center;
		margin-bottom: 100rpx;
		color: #e6e6e6;
		font-size: 24upx;
	}

	/* 加载动图 */
	.artileload {
		height: 80rpx;
		width: 80rpx;
		margin: 20rpx auto;
		overflow: hidden;
	}
</style>