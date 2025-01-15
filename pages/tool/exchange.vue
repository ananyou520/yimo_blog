<template>
	<!-- https://ext.dcloud.net.cn/plugin?id=2630 -->
	<view class="page">
		<view class="head-info">
			<!-- 搜索 -->
			<view style="margin-top: 95rpx;" class="head-search">
				<view @click="back()" class="icon-info" style="margin-left: 20rpx;">
					<text class="cuIcon-back"></text>
					<!-- <image src="/static/xiaoxi_ico.png" mode=""></image> -->
				</view>
				<uni-search-bar v-model="searchValue"
					style="opacity: 0.4; margin-top: -15rpx;width: 63%;margin-left: 30rpx;" radius="10"
					placeholder="搜索一下，爱上这个世界" @confirm="search" cancelButton="none" bgColor="#fff" />
			</view>
			<!-- 分类列表 -->
			<view class="classify-list">
				<view class="list" v-for="(item, index) in classList" :class="{ action: classifyShow == index }"
					@click="onClassify(item, index)" :key="index">
					<text>{{ item.name }}</text>
					<text class="line" v-show="classifyShow == index"></text>
				</view>
			</view>
		</view>
		<!-- <mescroll-body ref="mescrollRef" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" :top="0"> -->
		<view class="main">
			<!-- 轮播图 -->
			<view class="banner">
				<swiper class="screen-swiper square-dot" indicator-dots="true" circular="true" autoplay="true"
					interval="3000" duration="500">
					<swiper-item v-for="(item, index) in swiperList" :key="index">
						<image :src="item.url" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</view>

			<!-- 通知 -->
			<view class="inform">
				<view class="inform-info">
					<view class="picture">
						<image src="/static/imgs/gg_ico.png" mode=""></image>
					</view>
					<view class="info">
						<swiper class="swiper" :circular="true" :vertical="true" :indicator-dots="false"
							:autoplay="true" :interval="3000" :duration="1000">
							<swiper-item v-for="(item,index) in exchangeList" :key="index">
								<view class="swiper-item"><text class="one-omit">微信用户_{{item.recordsUserId}} 兑换了 {{item.goodsName}}</text>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>

			<!-- 为你推荐 -->
			<view class="recommend-info">
				<view class="recommend-title">
					<view class="title">
						<image src="/static/imgs/wntj_title.png" mode=""></image>
					</view>
				</view>
				<view class="goods-list">
					<view class="list" v-for="(item, index) in goodsList" @click="onSkip(item)" :key="index">
						<view class="pictrue">
							<image :src="baseUrl+item.goodsImg"></image>
						</view>
						<view class="title-tag">
							<view class="tag">
								<text v-if="item.isHot === 0">火爆</text>
								{{ item.goodsName }}
							</view>
						</view>
						<view class="price-info">
							<view class="user-price">
								<text class="cuIcon-vip min"></text>
								<text class="max">{{ item.goodsExchange }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
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
		<!-- </mescroll-body> -->
		<!-- <ClassifyData v-show="classifyShow != 0"></ClassifyData> -->
		<!-- tabbar -->
		<!-- <TabBar :tabBarShow="0"></TabBar> -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		getConfigKey
	} from "@/api/app/public.js"
	import {
		getDicts,
		listExchange,
		listGoods,
		appGetUserById,
		exchangeGoods
	} from "@/api/app/index.js"
	import config from '@/config'
	export default {
		components: {},
		data() {
			return {
				baseUrl: config.baseUrl,
				searchValue: "",
				swiperList: [],
				slideNum: 0,

				classList: [{
					id: 0,
					name: '全部'
				}],
				goodsList: [],
				classifyShow: 0,
				// 页面高度
				pageHeight: 500,
				exchangeList: [],
				queryParams: {
					pageNum: 1,
					pageSize: 6,
				},
				total: 0,
				showTotal: false,
				userId: null,
			};
		},
		onLoad() {
			var that = this;
			this.userId = uni.getStorageSync("userInfo").userId
			//获取轮播图
			getConfigKey("miniapp.index.swiper").then(response => {

				that.swiperList = []
				var swiper = response.msg.split(",")
				for (var i = 0; i < swiper.length; i++) {
					var obj = {
						id: i,
						type: 'image',
						url: swiper[i]
					}
					that.swiperList.push(obj)
				}
			})
			//获取类型标签
			getDicts("exchange_goods_type").then(response => {
				this.classList = [{
					id: 0,
					name: '全部'
				}]
				for (var i = 0; i < response.data.length; i++) {
					var type = {
						id: response.data[i].dictValue,
						name: response.data[i].dictLabel
					}
					this.classList.push(type)
				}
			})
			//获取兑换记录列表
			listExchange({
				pageNum: 1,
				pageSize: 5,
			}).then(response => {
				that.exchangeList = response.rows
			})
			//获取兑换商品列表
			this.getListGoods()
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
				listGoods(this.queryParams).then(response => {
					that.goodsList = that.goodsList.concat(response.rows)
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
			onSkip(e) {
				console.log(e)
				this.$tab.navigateTo('/pages/tool/exchangeinfo?goodsImg='+e.goodsImg+"&goodsName="+e.goodsName+"&goodsExchange="+e.goodsExchange+"&isHot="+e.isHot+"&isCami="+e.isCami+"&camiType="+e.camiType)
			},
			onSkip2(e) {
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
						content: '确认要消耗 ' + e.goodsExchange + " 积分兑换吗？",
						success: function(res) {
							if (res.confirm) {
								// 执行确认后的操作
								appGetUserById(that.userId).then(response => {
									if (e.goodsExchange > response.user.integral) {
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
										console.log(e)
										var data = {
											goodsName: e.goodsName,
											recordsUserId: that.userId,
											recordsNumber: e.goodsExchange,
											
										}
										exchangeGoods(data).then(response => {
											uni.showModal({
											        title: '提示',
											        content: '兑换成功，请到我的界面联系我们？',
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
			// 搜索触发
			search(e) {
				var json = e.value;
				this.queryParams.pageNum = 1
				this.queryParams.goodsName = json
				this.queryParams.goodsType = null
				this.classifyShow = 0;
				this.getListGoods()
			},
			getListGoods() {
				listGoods(this.queryParams).then(response => {
					this.goodsList = response.rows
					var allTotal = this.queryParams.pageNum * this.queryParams.pageSize
					this.total = response.total
					if (allTotal < this.total) {
						this.showTotal = true;
					} else {
						this.showTotal = false;
					}
				})
			},
			back() {
				uni.navigateBack()
			},
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback() {
				this.mescroll.endSuccess();
			},
			/*上拉加载的回调*/
			upCallback(page) {
				setTimeout(() => {
					this.mescroll.endByPage(10, 20);
				}, 2000);
			},
			/**
			 * 菜单导航滚动
			 */
			ScrollMenu(e) {
				let scrollLeft = e.target.scrollLeft;
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.nav')
					.boundingClientRect(data => {
						let wid = e.target.scrollWidth - data.width - (data.left * 2 + 5);
						this.slideNum = ((scrollLeft / wid) * 300) / 2;
					})
					.exec();
			},


			/**
			 * 分类点击
			 * @param {Object} item
			 * @param {Number} index
			 */
			onClassify(item, index) {
				if (item.id == 0) {
					this.queryParams.goodsType = null
				} else {
					this.queryParams.goodsType = item.id
				}
				this.classifyShow = index;
				this.queryParams.pageNum = 1
				this.queryParams.goodsName = null
				this.getListGoods()
			},

		}
	};
</script>

<style scoped lang="scss">
	$base: #fe3b0f; // 基础颜色
	$assist-clor: #ff4e17; // 辅助颜色
	$change-clor: #fc603a; // 渐变色
	$floor-clor: #fafafa; // 底部颜色
	$price-clor: #ff0000; // 价格颜色

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

	.page {
		// position: absolute;
		// left: 0;
		// top: 0;
		// width: 100%;
		// height: 100%;
		// overflow-x: hidden;
		// overflow-y: auto;
		padding-bottom: 100rpx;
		background-color: #ffffff;
	}

	.head-info {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 100;
		width: 100%;
		height: 285rpx;
		background: url(@/static/imgs/head_bg.png) no-repeat;
		background-size: 100% 433rpx;
		background-color: #ffffff;
		overflow: hidden;

		.head-search {
			display: flex;

			.icon-info {
				display: flex;
				align-items: center;
				height: 100%;

				text {
					font-size: 50rpx;
					color: #f6f6f6;
					margin-top: 10rpx;
				}

				image {
					width: 42rpx;
					height: 43rpx;
				}
			}

			.search {
				display: flex;
				width: 60%;
				padding: 0 20rpx;
				height: 65rpx;
				background-color: rgba(255, 255, 255, 0.3);
				border-radius: 10rpx;
				margin-left: 50rpx;

				.icon {
					display: flex;
					align-items: center;
					margin-right: 20rpx;

					image {
						width: 27rpx;
						height: 29rpx;
					}
				}

				.hint {
					display: flex;
					align-items: center;

					.max {
						font-size: 30rpx;
						font-weight: bold;
						color: #ffffff;
					}

					.min {
						font-size: 24rpx;
						color: #f6f6f6;
						margin-left: 10rpx;
					}
				}
			}
		}

		.classify-list {
			white-space: nowrap;
			width: 100%;
			height: 100rpx;
			overflow-x: auto;
			overflow-y: hidden;

			.list {
				position: relative;
				display: inline-block;
				width: 20%;
				height: 100%;
				line-height: 100rpx;
				text-align: center;

				text {
					font-size: 28rpx;
					color: #ffffff;
					opacity: 0.8;
				}

				.line {
					position: absolute;
					left: 50%;
					bottom: 20rpx;
					width: 90%;
					height: 8rpx;
					background: linear-gradient(to right, #f8f893, #fe9d00);
					border-radius: 10rpx;
					transform: translate(-50%, 0);
				}
			}

			.action {
				text {
					font-size: 32rpx;
					opacity: 1;
				}
			}
		}
	}

	.main {
		margin-top: 285rpx;
		padding-top: 20rpx;
		background-color: #ffffff;
	}

	/* banner */
	.banner {
		padding: 0 25rpx;
		height: 260rpx;
		margin-bottom: 30rpx;
		// margin: -200rpx auto 20rpx;
		border-radius: 10rpx;
		overflow: hidden;

		.screen-swiper {
			height: 100%;
			min-height: 100% !important;

			image {
				height: 260rpx;
				border-radius: 10rpx;
			}
		}
	}

	/* 通知 */
	.inform {
		padding: 0 25rpx;
		// height: 130rpx;
		// margin: 30rpx auto;
		border-bottom: 16rpx solid #f9f9f9;

		.inform-info {
			display: flex;
			padding: 0 20rpx;
			height: 70rpx;
			background-color: #f7f7f7;
			border-radius: 10rpx;

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
				width: 80%;
				height: 100%;

				.swiper {
					width: 100%;
					height: 100%;

					.swiper-item {
						display: flex;
						align-items: center;
						width: 100%;
						height: 100%;

						text {
							font-size: 28rpx;
							color: #848281;
						}
					}
				}
			}
		}
	}

	.one-omit {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* 为你推荐 */
	.recommend-info {
		width: 100%;
		background-color: #f2f2f2;

		.recommend-title {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100rpx;

			.title {
				display: flex;
				align-items: center;

				image {
					width: 416rpx;
					height: 40rpx;
				}
			}
		}

		.goods-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 0 30rpx;

			.list {
				width: 49%;
				height: 540rpx;
				margin-bottom: 20rpx;
				background-color: #ffffff;
				border-radius: 10rpx;
				overflow: hidden;

				.pictrue {
					display: flex;
					justify-content: center;

					image {
						height: 350rpx;
						width: 350rpx;
					}
				}

				.title-tag {
					// display: flex;
					height: 100rpx;
					padding: 20rpx;

					.tag {
						float: left;
						margin-right: 10rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						white-space: normal;
						font-size: 26rpx;
						line-height: 40rpx;

						text {
							font-size: 24rpx;
							color: #ffffff;
							padding: 4rpx 16rpx;
							background: linear-gradient(to right, $base, $change-clor);
							border-radius: 6rpx;
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
					height: 80rpx;

					.user-price {
						display: flex;
						align-items: center;

						text {
							color: $price-clor;
						}

						.min {
							font-size: 28rpx;
						}

						.max {
							font-size: 32rpx;
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
	}
</style>