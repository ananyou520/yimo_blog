<template>
	<view class="">
		<image style="position: relative;z-index: 1;" class="fengrui-img" src="/static/imgs/index_bj.jpg"
			mode="aspectFill"></image>
		<view style="position: relative;z-index: 2;" class="index-box">
			<view class="notice-box">
				<image class="notice-svg" src="/static/imgs/zt.svg" mode=""></image>
				<view class="notice-text">
					<p>{{noticeStr}}</p>
				</view>
			</view>
			<!-- 轮播图 -->
			<carousel :img-list="swiperData" url-key="url" @selected="selectedBanner"/>
			<!-- <uni-swiper-dot class="uni-swiper-dot-box" :info="swiperData" :current="current" field="content">
				<swiper autoplay :circular="true" interval="2000" class="swiper-box" :current="swiperDotIndex"
					@change="changeSwiper">
					<swiper-item v-for="(item, index) in swiperData" :key="index">
						<view class="swiper-item" @click="clickBannerItem(item)">
							<image :src="item.image" mode="aspectFill" :draggable="false" />
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot> -->
			<view class="index-info">
				<view class="mt30 grid text-center col-4 bg-white" style="padding: 30rpx 0; border-radius: 15rpx;row-gap: 30rpx;">
					<view @click="Jump('/pages/tool/wallpaper')">
						<image  class="cell_3_icon flex justify-center align-center" style="height:65rpx;" src="/static/imgs/sjbz.png" mode="aspectFit">
						</image>
						<view>手机壁纸</view>
					</view>
					<view @click="Jump('/pages/tool/computer')">
						<image  class="cell_3_icon flex justify-center align-center" style="height: 65rpx;" src="/static/imgs/dnbz.png" mode="aspectFit">
						</image>
						<view>电脑壁纸</view>
					</view>
					<view @click="Jump('/pages/tool/video')">
						<image  class="cell_3_icon flex justify-center align-center" style="height: 65rpx;" src="/static/imgs/sp.png" mode="aspectFit">
						</image>
						<view>视频资源</view>
					</view>
					<view @click="Jump('/pages/tool/shuiyin')">
						<image  class="cell_3_icon flex justify-center align-center" style="height: 65rpx;" src="/static/imgs/sycc.png" mode="aspectFit">
						</image>
						<view>去除水印</view>
					</view>
				</view>
				<view class="titel-vi">
					<view class="titel-vi-q">
						<view class="titel-vi-img">
							<image class="notice-ioc" src="/static/imgs/zxwz.svg" mode="aspectFill"></image>
						</view>
						<view class="titel-vi-font">最新文章</view>
					</view>
					<view class="titel-vi-right" @tap="categoryNew()">
						查看更多
					</view>
				</view>
				<!-- 文章列表 -->
				<view class="blog-box" v-for="(item,index) in blogList" :key="index" @click="blogInfo(item.id)">
					<view style="height: 370rpx;background-color: white;overflow: hidden;padding: 25rpx;border-radius: 30rpx;" v-if="item.ad == 1 && adUnitId2">
						<view style="height: 325rpx;overflow: hidden;">
							<ad-custom style="height: 325rpx !important" :unit-id="adUnitId2" ad-intervals="30" ></ad-custom>
						</view>
					</view>
					<view style="height: 240rpx;" v-else>
						<image class="blog-img" :src="baseUrl+item.showImg"></image>
						<view class="info-box">
							<view class="ellipsis-multiline">
								{{item.title}}
							</view>
							<view class="info-icon">
								<image  v-if="item.isAd == 0" class="muen-sld-icon" src="/static/public/guanggao.svg" mode=""></image>
								<image  v-if="item.appResourceId" class="muen-sld-icon" src="/static/public/xiazai.svg" mode=""></image>
								<image  v-if="item.weight == 999" class="muen-sld-icon2" src="/static/public/top.svg" mode=""></image>
							</view>
							<view class="muen-sld-time"><text style="float: left;">{{item.createTime}}</text>
							<text class="cuIcon-attention look-number"><text>{{item.lookNumber}}</text></text></view>
						</view>
					</view>
				</view>
			</view>
			
			
		</view>
		<!-- 加载动图 -->
		<view class="artileload" v-if="showTotal">
			<image style="width: 100%;height: 100%;" src="/static/public/articleload.gif" mode="aspectFit"></image>
		</view>
		<!-- 文章列表没有数据 -->
		<view class="no-list-data" v-else>
			--我的底线就到这里了--
		</view>
		<!--通知弹窗-->
		<view class="cu-modal" :class="modalName=='indexModal'?'show':''">
			<view style="border-radius: 30rpx;" class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view style="color: black;font-size: 38rpx;margin-top: 50rpx;" class="content">通知</view>
				</view>
				<view class=" bg-white">
					<view style="font-size: 33rpx;color: #6a6a6a;padding: 40rpx 60rpx 60rpx 60rpx;">
						{{modalInfo}}
					</view>
		
					<button @tap="hideModal" style="margin-bottom: 50rpx;width: 55%;height: 90rpx;font-size: 38rpx;"
						class="cu-btn bg-green">确认</button>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='Nomini'?'show':''">
			<view style="border-radius: 30rpx;" class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view style="color: black;font-size: 38rpx;margin-top: 50rpx;" class="content">提示</view>
				</view>
				<view class=" bg-white">
					<view style="font-size: 33rpx;color: #6a6a6a;padding: 40rpx 60rpx 60rpx 60rpx;">
						请您使用手机访问，谢谢 !
					</view>
		
					<button @tap="offApp" style="margin-bottom: 50rpx;width: 55%;height: 90rpx;font-size: 38rpx;"
						class="cu-btn bg-green">知道了</button>
				</view>
			</view>
		</view>
		
	</view>
</template>


<script>

	import {
		getConfigKey
	} from "@/api/app/public.js"
	import {
		listArticle,newUser,wxLogin,autoLoginWx,getSysSet
	} from "@/api/app/index.js"
	import {
		getQiniuToken
	} from "@/utils/qiniu.js"
	import {
		getToken,setToken
	} from '@/utils/auth'
	import carousel  from '@/components/lun-bo-tu/lun-bo-tu';
	import config from '@/config'
	let interstitialAd = null
	export default {
		components: {
		            carousel
		        },
		data() {
			return {
				baseUrl: config.baseUrl,
				adUnitId:"",
				adUnitId2:"",
				TabCur: 0,
				scrollLeft: 0,
				current: 0,
				swiperDotIndex: 0,
				swiperData: [],
				noticeStr:"",
				blogList:[],
				queryParams: {
				  pageNum: 1,
				  pageSize: 6,
				  isShow: 1
				},
				total:0,
				showTotal:false,
				modalName:null,
				modalInfo:"",
				platform: 0
			}
		},
		onShareAppMessage() {
		    return {
		    	title: "同学快过来看！这里有一个能搜资源的好东西！",
		    	imageUrl: "",
		    	path: 'pages/index?userid='+this.userid,
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
		onLoad(option) {
			var that = this;
			this.adUnitId2 = uni.getStorageSync("sysSet").computerAd
			wx.getSystemInfo({
				success: (res) => {
					console.log(res.platform)
					if (res.platform == 'mac' || res.platform == 'windows') {
						this.platform = 1
						// that.modalName = 'Nomini'
						// return;
					}
				}
			})
			//自动登录
			uni.login({
				provider: 'weixin',
				success: loginRes => {
					//获取openid
					autoLoginWx(loginRes.code).then(response => {
						var antoInfo = JSON.parse(response.msg)
						var data = {
							openId: antoInfo.openid,
							oldUserId : 0
						}
						//邀请用户
						if(option.userid && option.userid != 'undefined'){
							data.oldUserId = option.userid
						}
						//登录
						wxLogin(data).then(logininfo => {
							setToken(logininfo.token)
							//设置用户信息
							this.$store.dispatch('GetInfo').then(res => {
								
							})
						})
					})
							
				}
			});
			//获取系统配置数据
			getSysSet().then(setinfo => {
				//设置缓存
				uni.setStorageSync("sysSet", setinfo)
				//公告
				that.noticeStr = setinfo.indexNotice
				//弹窗通知是否关闭
				var isModalOff = setinfo.indexModalInfo.split("#")[0]
				//弹窗通知内容
				that.modalInfo = setinfo.indexModalInfo.split("#")[1]
				//判断弹窗
				if(isModalOff == "true" && uni.getStorageSync("isIndexModal") != that.modalInfo){
					that.modalName = "indexModal"
					uni.setStorageSync("isIndexModal", that.modalInfo)
				}
				//轮播图
				that.swiperData = []
				var swiper = setinfo.indexSwiper.split(",")
				for(var i=0; i < swiper.length; i++){
					that.swiperData.push({image:swiper[i]})
				}
			})
			//获取文章列表
			this.getBlogList()
			//初始化插屏广告
			that.adUnitId = uni.getStorageSync("sysSet").homeAd
			this.getWxchaAd()
			
		},
		// 上了分页
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
					if(that.platform == 0 && that.adUnitId2){
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
			offApp(){
				uni.exitMiniProgram({
				  success: function () {
					  console.log("=")
				  },
				  fail: function (err) {
					  console.log(err)
				  }
				});
			},
			// 插屏广告数据
			getWxchaAd: function() {
				var that = this;
				//#ifdef MP-WEIXIN	
				if (this.adUnitId != '') {
			
					// 在页面onLoad回调事件中创建插屏广告实例
					if (wx.createInterstitialAd) {
						interstitialAd = wx.createInterstitialAd({
							adUnitId: this.adUnitId
						})
						interstitialAd.onLoad(() => {
						})
						interstitialAd.onError((err) => {})
						interstitialAd.onClose(() => {})
					}
			
					// 在适合的场景显示插屏广告
					if (interstitialAd) {
						interstitialAd.show().catch((err) => {
							console.error(err)
						})
					}
				} else {
					console.log('没有流量主')
				}
				//#endif	
			
			},
			categoryNew(){
				uni.switchTab({
					url: '/pages/search/index'
				});
			},
			getBlogList(){
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
					if(that.platform == 0 && that.adUnitId2){
						that.blogList.splice(3, 0, {ad:1});
					}
				})
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			clickBannerItem(item) {
				console.log(item)
			},
			changeSwiper(e) {
				this.current = e.detail.current
			},
			blogInfo(id){
				this.$tab.navigateTo('/pages/blog/bloginfo?id='+id)
			},
			Jump(url){
				this.$tab.navigateTo(url)
			},
			hideModal() {
				this.modalName = null
			},
		}
	}
</script>

<style lang="scss">
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
	.look-number {
		font-size: 22rpx;
		float: right;
	}

	.look-number text {
		margin-left: 10rpx;
	}

	.blog-box {
		width: 100%;
		background-color: white;
		border-radius: 18rpx;
		margin-bottom: 20rpx;
	}

	.blog-img {
		height: 200rpx;
		width: 43%;
		margin-top: 20rpx;
		margin-left: 25rpx;
		border-radius: 18rpx;
		display: inline-block;
		float: left;
	}

	.muen-sld-time {
		font-size: 22rpx;
		margin-top: 20rpx;
		margin-left: 25rpx;
		float: left;
		color: #ADADAD;
		width: 100%;
		line-height: 20rpx;
	}

	.muen-sld-icon {
		width: 35rpx;
		height: 35rpx;
		margin-left: 25rpx;
		margin-top: 23rpx;
		float: left;
	}
	.muen-sld-icon2 {
		width: 43rpx;
		height: 43rpx;
		margin-left: 25rpx;
		margin-top: 20rpx;
		float: left;
	}

	.info-box {
		width: 48%;
		display: inline-block;
	}

	.ellipsis-multiline {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		margin-top: 32rpx;
		margin-left: 25rpx;
		height: 72rpx;
	}

	.info-icon {
		height: 55rpx;
	}

	/* 标题 */
	.titel-vi-right {
		color: #989898;
		height: 80upx;
		line-height: 80upx;
		font-size: 20upx;
	}

	.titel-vi-font {
		font-size: 30upx;
		margin-left: 24upx;
	}

	.titel-vi-img {
		width: 36upx;
		height: 36upx;
	}

	.titel-vi {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 10upx 30upx 0upx 30upx;
	}

	.titel-vi-q {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.notice-box {
		width: 100%;
		margin-top: 50rpx;
		margin-bottom: 30rpx;
	}

	.notice-ioc {
		height: 40upx;
		width: 140upx;
		display: inline-block;
		float: left;
	}
	.notice-svg {
		height: 50upx;
		width: 100upx;
		display: inline-block;
		float: left;
		margin-top: -1rpx;
	}

	.notice-text {
		display: inline-block;
		margin-left: 5rpx;
		margin-top: 10rpx;
		width: 435upx;
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

	.index-info {
		z-index: 1;
		margin-left: 20rpx;
		margin-right: 20rpx;
		margin-top: 15rpx;

	}
	.index-box {
		z-index: 1;
		margin-top: -370rpx;
	}

	.fengrui-img {
		width: 100%;
	}

	/* #ifndef APP-NVUE */
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #F7F7F7;
		min-height: 100%;
		height: auto;
	}

	view {
		font-size: 14px;
		line-height: inherit;
	}

	/* #endif */

	.swiper {
		height: 300rpx;
	}

	.swiper-box {
		height: 150px;
		overflow: hidden;
		border-radius: 30rpx;
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
		height: 300rpx;
		line-height: 300rpx;
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