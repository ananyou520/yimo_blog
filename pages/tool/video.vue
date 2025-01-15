<template>
	<view>
		<!-- 轮播图 --> 
		<uni-swiper-dot class="uni-swiper-dot-box" :info="swiperData" :current="current" field="content">
			<swiper autoplay :circular="true" interval="2000" class="swiper-box" :current="swiperDotIndex"
				@change="changeSwiper">
				<swiper-item v-for="(item, index) in swiperData" :key="index">
					<view class="swiper-item">
						<image :src="item" mode="aspectFill" :draggable="false" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<view class="notice-box">
			<image class="notice-svg" src="/static/public/tz.svg" mode=""></image>
			<view class="notice-text">
				<p> 已更新至 {{number}} 个资源--复制链接后浏览器打开</p>
			</view>
		</view>
		<view class="search">
			<uni-search-bar v-model="searchValue" class="" radius="190" placeholder="请输入要查询的资源名" @confirm="search"
				cancelButton="none" bgColor="#fff" />
		</view>
		<view @click="search" class="select">
			查询
		</view>
		<view class="solids-bottom info-top">
			<image class="info-top-svg" src="/static/public/new.svg"></image>
			<text style="">最新更新</text>
			<text style="float: right;margin-right: 30rpx;">资源链接</text>
		</view>
		<view v-if="dataList.length != 0" v-for="(item,index) in dataList" :key="index" class="solids-bottom info-list">
			<view class="info-name">{{item.bjName}}</view>
			<!-- 直接复制 -->
			<text @click="copy(item.djUrl)" class="info-copy">复制链接</text>
			<!-- 积分兑换 -->
			<!-- <text @click="jfAd(item.djUrl)" class="info-copy">复制链接</text> -->
			<!-- 图片描述获取 -->
			<text @click="showImg('http://i.mansg.cn/zb_users/upload/2023/09/202309111694394953432247.png')" class="info-copy">获取链接</text>
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
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view style="border-radius: 30rpx;" class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view style="color: black;font-size: 38rpx;margin-top: 50rpx;" class="content">提示</view>
				</view>
				<view class=" bg-white">
					<view style="font-size: 33rpx;color: #6a6a6a;padding: 40rpx 60rpx 60rpx 60rpx;">
						观看链接已复制到您的粘贴板中，请复制到浏览器中获取，链接中的资源可能存在排序混乱，画质模糊和观看时长限制，建议您转存至自己的网盘中使用即可解决此等问题(链接有效期为30分钟)
					</view>
		
					<button @tap="hideModal" style="margin-bottom: 50rpx;width: 55%;height: 90rpx;font-size: 38rpx;"
						class="cu-btn bg-green">知道了</button>
				</view>
			</view>
		</view>
		<!--弹窗-->
		<view class="cu-modal" :class="modalName=='ModalImg'?'show':''">
			<view style="border-radius: 30rpx; background-color: white;" class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view style="color: black;font-size: 38rpx;margin-top: 40rpx;" class="content">获取方式</view>
					<view class="action" @tap="modalName = null">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class=" bg-white">
					<image style="width: 75%;" mode="widthFix" show-menu-by-longpress="true"
						:src="modelSrc"></image>
					<view class="tipinfo">Tip：长按图片识别 / 保存</view>
				</view>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		listDuanju,duanjuNumber,appGetUserById,exchangeResource,getConfigKey
	} from "@/api/app/index.js"
	export default {
		data() {
			return {
				adUnitId: "",
				current: 0,
				swiperDotIndex: 0,
				swiperData: ['/static/imgs/index_bj.jpg',
					'/static/imgs/index_bj.jpg', '/static/imgs/index_bj.jpg'
				],
				queryParams: {
					pageNum: 1,
					pageSize: 20,
					bjName:null,
					isShow: 1,
				},
				dataList: [],
				total: 0,
				showTotal: false,
				searchValue: null,
				modalName:null,
				number:0,
				userId: null,
				dhNum:0,
				modelSrc:null
			}
		},
		onLoad() {
			this.adUnitId = uni.getStorageSync("sysSet").phoneAd
			this.userId = uni.getStorageSync("userInfo").userId
			var that = this
			duanjuNumber().then(response => {
				this.number = response
			})
			getConfigKey("miniapp.sp.num").then(response => {
				that.dhNum = response.msg
				
			})
			this.getDataList()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.queryParams = {
				pageNum: 1,
				pageSize: 20,
			}
			this.searchValue = null
			this.getDataList()
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
				listDuanju(this.queryParams).then(response => {	
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
		onShareAppMessage() {
		    return {
		    	title: "同学快过来看！这里有一个能搜资源的好东西！",
		    	imageUrl: "",
		    	path: 'pages/tool/video',
		    }
		},
		onShareTimeline(){
		    return {
		      title:'同学快过来看！这里有一个能搜资源的好东西！',
		      query:{
		      },
		      imageUrl:''
		    }
		},
		methods: {
			showImg(url){
				this.modelSrc = url
				console.log(this.modelSrc)
				this.modalName = "ModalImg"
				
			},
			jfAd(url){
				var that = this;
				uni.showModal({
					title: '提示',
					content: '获取需要消耗 ' + that.dhNum + " 积分，兑换吗？",
					success: function(res) {
						if (res.confirm) {
							appGetUserById(that.userId).then(response => {
								if (that.dhNum > response.user.integral) {
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
										source: '视频兑换',
										isAdd: 1,
										integralNumber: that.dhNum,
										userId: that.userId,
									}
									exchangeResource(data).then(response => {
										that.$refs.uToast.show({
											type: 'success',
											title: '',
											message: "兑换成功",
											icon: false
										})
										that.copy(url)
									})
								}
							
							
							})
						}
					}
				})
				
			},
			copy(url){
				var that = this;
				uni.setClipboardData({
					data: url,
					showToast: false,
					success: function () {
						that.modalName = "Modal"
					}
				});
			},
			// 搜索触发
			search() {
				this.queryParams.pageNum = 1
				this.queryParams.bjName = this.searchValue;
				this.getDataList()
				this.$refs.uToast.show({
					type: 'success',
					title: '',
					message: "╮(๑•́ ₃•̀๑)╭ 列表已更新 ",
					icon: false
				})
			},
			getDataList() {
				var that = this;
				listDuanju(this.queryParams).then(response => {
					that.dataList = response.rows
					var allTotal = this.queryParams.pageNum * this.queryParams.pageSize
					that.total = response.total
					if (allTotal < this.total) {
						this.showTotal = true;
					} else {
						this.showTotal = false;
					}
					uni.stopPullDownRefresh(); //停止刷新
				})
			},
			changeSwiper(e) {
				this.current = e.detail.current
			},
			hideModal() {
				this.modalName = null
			},

		}
	}
</script>

<style>
	page {
		background-color: white;
	}
	.tipinfo {
		width: 60%;
		height: 80rpx;
		border-radius: 60rpx;
		text-align: center;
		/* border: 3rpx solid #ae67d6; */
		margin-left: 20%;
		line-height: 80rpx;
		margin-bottom: 40rpx;
		color: #ae67d6;
		font-size: 30rpx;
		font-weight: 600;
	}

	.uni-searchbar {
		padding: 15rpx !important;
	}

	.search {
		border: 3rpx solid #89B9D8;
		margin: 20rpx;
		border-radius: 15rpx;
		margin-top: 40rpx;
	}

	.info-top {
		background: #F8F8F8;
		height: 100rpx;
		line-height: 100rpx;
		margin-top: 30rpx;
		font-size: 31rpx;
		font-weight: 600;
	}

	.info-top-svg {
		height: 70upx;
		width: 70upx;
		margin: 15rpx;
		float: left;
		margin-top: 12rpx;
	}

	.info-list {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 29rpx;
	}

	.info-copy {
		float: right;
		margin-right: 30rpx;
		color: #1E90FF;
	}

	.info-name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 530rpx;
		display: inline-block;
		color: #636363;
		margin-left: 22rpx;
	}

	.select {
		width: 60%;
		margin-left: 20%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background-color: #78B7E0;
		color: white;
		border-radius: 15rpx;
		font-size: 35rpx;
		font-weight: 600;
		margin-top: 40rpx;
	}

	.notice-box {
		width: 100%;
		margin-bottom: 20rpx;
		height: 80rpx;
		line-height: 80rpx;
		box-shadow: 0 -5px 13px -1px rgba(0, 0, 0, 0.6);
	}

	.notice-svg {
		height: 80upx;
		width: 80upx;
		display: inline-block;
		float: left;
		margin-top: -1rpx;
		margin-left: 10rpx;
	}

	.notice-text {
		display: inline-block;
		margin-left: 20rpx;
		width: 590upx;
		overflow: hidden;
		white-space: nowrap;
		box-sizing: border-box;
		color: #DE9C10;
	}

	.notice-text p {
		display: inline-block;
		font-weight: 600;
		/* padding-left: 100%;
		animation: marquee 15s linear infinite; */
	}

	@keyframes marquee {
		0% {
			transform: translateX(0);
		}

		100% {
			transform: translateX(-100%);
		}
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

	.swiper {
		height: 400rpx;
	}

	.swiper-box {
		height: 200px;
		overflow: hidden;
		transform: translateY(0);
	}

	.swiper-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #fff;
		height: 400rpx;
		line-height: 400rpx;
	}

	@media screen and (min-width: 500px) {
		.uni-swiper-dot-box {
			width: 400px;
			/* #ifndef APP-NVUE */
			margin: 0 auto;
			/* #endif */
			margin-top: 8px;
		}

		.image {
			width: 100%;
		}
	}
</style>