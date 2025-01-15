<template>
	<view>
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
				<text class="cuIcon-title text-orange "></text> 资源列表
			</view>
		</view>
		<view v-if="dataList.length != 0" class="bg-white padding">
			<view class="grid margin-bottom col-2">
				<view @click="info(item.id)" v-for="(item,index) in dataList" :key="index" class="grid-box">
					<view style="width: 327rpx;height: 377rpx;background-color: white;overflow: hidden;" v-if="item.ad == 1">
						<ad-custom style="height: 377rpx !important;" :unit-id="adUnitId" ad-intervals="30" ></ad-custom>
					</view>
					<view v-else>
						<image class="grid-img" :src="baseUrl+item.showImg"></image>
						<view class="grid-name">{{item.resourceTitle}}</view>
						<!-- <view v-if="item.isAd == 0" class="ad">激励广告</view> -->
						<view  class="notad">获取详情</view>
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
	</view>
</template>

<script>
	import {
		listResource,
		getDicts
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
					pageSize: 4,
					isShow: 1,
					resourceType:"3"
				},
				TypeList: [],
				dataList: [],
				total: 0,
				showTotal: false,
				searchValue: null,
				platform: 0
			}
		},
		onLoad() {
			this.adUnitId = uni.getStorageSync("sysSet").phoneAd
			wx.getSystemInfo({
				success: (res) => {
					console.log(res.platform)
					//ios android
					if (res.platform == 'mac' || res.platform == 'windows') {
						this.platform = 1
					}
				}
			})
			//获取文章列表
			this.getResourceList()
			//获取文章类型标签
			getDicts("app_label").then(response => {
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
			}
			this.searchValue = null
			this.getResourceList()
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
				listResource(this.queryParams).then(response => {
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
			searchType(type) {
				this.queryParams.pageNum = 1
				this.queryParams.keyword = type
				this.searchValue = null
				this.getResourceList()
			},
			// 搜索触发
			search(e) {
				var json = e.value;
				this.queryParams.pageNum = 1
				this.queryParams.keyword = json
				this.getResourceList()
			},
			info(id) {
				this.$tab.navigateTo('/pages/blog/resource?id=' + id)
			},
			getResourceList() {
				var that = this;
				listResource(this.queryParams).then(response => {
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
		margin-bottom: 50rpx;
	}

	.grid-img {
		height: 250rpx;
		border-radius: 20rpx;
	}

	.grid-name {
		margin-top: 10rpx;
		white-space: nowrap; /* 确保文本在一行内显示 */
		overflow: hidden; /* 隐藏超出容器的文本 */
		text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
	}

	.container-h {
		color: #FFFFFF;
		font-size: 36upx;
		position: absolute;
		top: 70upx;
		left: 10%;
	}

	.container-slog {
		color: #FFFFFF;
		font-size: 24upx;
		position: absolute;
		top: 140upx;
		left: 10%
	}

	.container-search {
		position: absolute;
		width: 88%;
		top: 200upx;
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
</style>