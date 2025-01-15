<template>
	<view class="overfor-x">
		<!-- 搜索框 -->
		<view class="top-tile">文章搜索</view>
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
		<!-- <official-account  style="width:100%;"></official-account> -->
		<!-- 标签-->
		<view class='padding-sm flex flex-wrap'>

			<view @click="searchType(item.typeVal)" class="padding-xs" v-for="(item,index) in bLogTypeList"
				:key="index">
				<view class='cu-tag round light' :class="'bg-' + item.name">{{item.title}}</view>
			</view>
		</view>
		<!-- 热门文章 -->
		<view class="titel-felx">
			<view class="time-img">
				<image style="width: 100%;height: 100%;" src="/static/search/dstrict-3.svg" mode=""></image>
			</view>
			<view class="titel-h-go">
				热门文章
			</view>
		</view>
		<!-- 文章列表 -->
		<view v-if="blogList.length != 0" style="margin: 0 25rpx;">
			<view class="blog-box" v-for="(item,index) in blogList" :key="index" @click="blogInfo(item.id)">
				<view style="height: 370rpx;background-color: white;overflow: hidden;padding: 25rpx;border-radius: 30rpx;" v-if="item.ad == 1 && adUnitId">
					<view style="height: 325rpx;overflow: hidden;">
						<ad-custom style="height: 325rpx !important" :unit-id="adUnitId" ad-intervals="30" ></ad-custom>
					</view>
				</view>
				<view style="height: 200rpx;" v-else>
					<image class="blog-img" :src="baseUrl+item.showImg"></image>
					<view class="info-box">
						<view class="ellipsis-multiline">
							{{item.title}}
						</view>
						<view class="info-icon">
							<image v-if="item.isAd == 0" class="muen-sld-icon" src="/static/public/guanggao.svg" mode="">
							</image>
							<image v-if="item.appResourceId" class="muen-sld-icon" src="/static/public/xiazai.svg" mode="">
							</image>
						</view>
						<view class="muen-sld-time">{{item.createTime}}<text
								class="cuIcon-attention look-number"><text>{{item.lookNumber}}</text></text></view>
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
		listArticle,
		getDicts,
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
				searchValue: null,
				blogList: [],
				queryParams: {
					pageNum: 1,
					pageSize: 7,
					isShow: 1,
					articleType: null,
					keyword: null,
					orderType: "look_number"
				},
				bLogTypeList: [],
				total: 0,
				showTotal: false,
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
			this.getBlogList()
			//获取文章类型标签
			getDicts("article_type").then(response => {
				this.bLogTypeList = [];
				var randomNumber = this.getRandomNumber(0, 14, response.data.length)
				for (var i = 0; i < response.data.length; i++) {
					var type = {
						title: response.data[i].dictLabel,
						name: this.ColorList[randomNumber[i]].name,
						color: this.ColorList[randomNumber[i]].color,
						typeVal: response.data[i].dictValue
					}
					this.bLogTypeList.push(type)
				}
			})
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.queryParams = {
				pageNum: 1,
				pageSize: 7,
				isShow: 1,
				articleType: null,
				keyword: null,
				orderType: "look_number"
			}
			this.searchValue = null
			this.getBlogList()
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
				listArticle(this.queryParams).then(response => {
					if(that.platform == 0 && that.adUnitId){
						that.blogList.push({ad:1})
					}
					that.blogList = that.blogList.concat(response.rows)
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
			// 搜索触发
			search(e) {
				var json = e.value;
				this.queryParams.pageNum = 1
				this.queryParams.articleType = null
				this.queryParams.keyword = json
				this.getBlogList()
			},
			searchType(type) {
				this.queryParams.pageNum = 1
				this.queryParams.articleType = type
				this.queryParams.keyword = null
				this.searchValue = null
				this.getBlogList()
			},
			getRandomNumber(min, max, count) {
				const randoms = new Set();
				while (randoms.size < count) {
					const random = Math.floor(Math.random() * (max - min + 1)) + min;
					randoms.add(random);
				}
				return [...randoms];
			},

			getBlogList() {
				var that = this;
				listArticle(this.queryParams).then(response => {
					that.blogList = response.rows
					var allTotal = this.queryParams.pageNum * this.queryParams.pageSize
					that.total = response.total
					if (allTotal < this.total) {
						this.showTotal = true;
					} else {
						this.showTotal = false;
					}
					if(that.platform == 0 && that.adUnitId){
						that.blogList.splice(2, 0, {ad:1});
					}
					uni.stopPullDownRefresh(); //停止刷新
				})
			},
			blogInfo(id) {
				this.$tab.navigateTo('/pages/blog/bloginfo?id=' + id)
			}

		}
	}
</script>

<style lang="scss">
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff;
		min-height: 100%;
		height: auto;
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

	.top-tile {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		margin-top: 100rpx;
	}

	.overfor-x {
		overflow-x: hidden;
	}

	.container-h {
		color: #FFFFFF;
		font-size: 36upx;
		position: absolute;
		top: 240upx;
		left: 10%;
	}

	.container-slog {
		color: #FFFFFF;
		font-size: 24upx;
		position: absolute;
		top: 310upx;
		left: 10%
	}

	.container-search {
		position: absolute;
		width: 88%;
		top: 370upx;
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

	/* 标签 */
	.swiper-list {
		margin: 30upx 0upx 10upx 0upx;
		white-space: nowrap;
		width: 100%;
	}

	.label-list {
		padding: 12upx 36upx;
		background-color: #596982;
		border-radius: 100upx;
		margin-left: 30upx;
		color: #FFFFFF;
		font-size: 28upx;
		flex-shrink: 0;
		display: inline-block;
	}

	.label-list:last-child {
		margin-right: 30upx;
	}

	/* 热门 */
	.time-img {
		height: 40upx;
		width: 40upx;
	}

	.title-h-ad {
		height: 240upx;
		border-radius: 16upx;
		margin: 48upx;
		overflow: hidden;
	}

	.titel-felx {
		display: flex;
		align-items: center;
		padding: 28upx;
	}

	.titel-h-go {
		font-size: 32upx;
		margin-left: 20upx;
	}

	/* 文章列表 */
	.blog-box {
		width: 100%;
		background-color: white;
		border-radius: 30rpx;
		font-size: 25rpx;
	}

	.blog-img {
		height: 150rpx;
		width: 33%;
		margin-top: 25rpx;
		margin-left: 25rpx;
		border-radius: 25rpx;
		display: inline-block;
		float: left;
	}

	.muen-sld-time {
		font-size: 22rpx;
		margin-top: 12rpx;
		margin-left: 25rpx;
		float: left;
		color: #ADADAD;
		width: 100%;
		line-height: 20rpx;
	}

	.muen-sld-icon {
		width: 30rpx;
		height: 30rpx;
		margin-left: 25rpx;
		margin-top: 17rpx;
		float: left;
	}

	.info-box {
		width: 58%;
		display: inline-block;
	}

	.ellipsis-multiline {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		margin-top: 30rpx;
		margin-left: 25rpx;
		height: 70rpx;
	}

	.look-number {
		font-size: 22rpx;
		float: right;
	}

	.look-number text {
		margin-left: 10rpx;
	}

	.info-icon {
		height: 40rpx;
	}
</style>