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
				<text class="cuIcon-title text-orange "></text> 壁纸列表
			</view>
		</view>
		<view class="shuoming">为加速页面展示图片经过压缩处理，想要超清无损图请您下载！</view>
		<view v-if="dataList.length != 0" class="bg-white" style="padding: 25rpx;">
			<view class="grid margin-bottom col-1">
				<view @click="lookImg(item)" v-for="(item,index) in dataList" :key="index" class="grid-box">
					<view style="width: 100%;margin-bottom: 10rpx;" v-if="item.ad == 1 && adUnitId">
						<ad-custom :unit-id="adUnitId" ad-intervals="30" ></ad-custom>
					</view>
					<view v-else>
						<image class="grid-img" :src="baseUrl+item.compressImgUrl"></image>
						<view class="info-img">
							<view class="flex justify-between">
								<view  v-if="item.isAd != 0" class="img-type"><text class="cuIcon-rechargefill"></text> 免费获取</view>
								<view  v-else class="img-type"><text class="cuIcon-rechargefill"></text> 广告获取</view>
								<view class="img-down-number"><text class="cuIcon-likefill"></text>{{item.downNum}} 次下载</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="text-align: center;" v-else>
			<image style="width: 400rpx;height: 200rpx;" src="/static/public/nodata.svg"></image>
			<view style="color: #adadad;">无数据</view>
		</view>
		<!-- 加载动图 -->
		<view class="artileload" v-if="showTotal">
			<image style="width: 100%;height: 100%;" src="/static/public/articleload.gif" mode="aspectFit"></image>
		</view>
		<!-- 文章列表没有数据 -->
		<view class="no-list-data" v-else>
			--我的底线就到这里了--
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
	export default {
		data() {
			return {
				baseUrl: config.baseUrl,
				adUnitId:"",
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
					wallpaperType:2
				},
				TypeList: [],
				dataList: [],
				total: 0,
				showTotal: false,
				searchValue: null,
				thisObject:null,
				platform: 0
			}
		},
		onLoad() {
			this.adUnitId = uni.getStorageSync("sysSet").computerAd
			wx.getSystemInfo({
				success: (res) => {
					console.log(res.platform)
					if (res.platform == 'mac' || res.platform == 'windows') {
						this.platform = 1
					}
				}
			})
			//获取文章列表
			this.getWallpaperList()
			//获取文章类型标签
			getDicts("app_computer_label").then(response => {
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

		},
		// 下拉刷新
		onPullDownRefresh() {
			this.queryParams = {
				pageNum: 1,
				pageSize: 10,
				isShow: 1,
				keyword: null,
				wallpaperType:2
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
			lookImg(itme){
				this.$tab.navigateTo('/pages/tool/look_img?zipUrl='+itme.compressImgUrl+"&url="+itme.imgUrl+"&id="+itme.id+"&isAd="+itme.isAd+"&type=2")
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
						that.dataList.splice(1, 0, {ad:1});
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
	.shuoming{
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
		padding: 10rpx;
		position: relative;
	}

	.grid-img {
		height: 370rpx;
		width: 682rpx;
		border-radius: 15rpx;
	}
	.info-img{
		position: absolute;
		height: 50rpx;
		border-radius: 0 0 15rpx 15rpx;
		background-color: rgba(0, 0, 0, 0.3);
		bottom: 16rpx;
		line-height: 50rpx;
		font-size: 23rpx;
		width: 682rpx;
		
	}
	.img-down-number{
		color: white;
		margin-right: 20rpx;
	}
	.img-down-number text{
		font-size: 24rpx;
		color: red;
		margin-right: 6rpx;
	}
	.img-type{
		margin-left: 20rpx;
		color: white;
	}
	.img-type text{
		font-size: 24rpx;
		color: #3DB2FF;
		margin-right: 6rpx;
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
		margin: 30rpx 0px;
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