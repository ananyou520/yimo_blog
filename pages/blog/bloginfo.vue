<template>
	<view>
		<view class="index-ov container">
			<!-- <cover-view v-if="showCountdown" class="float-button">
				<cover-view v-if="timeEnd" class="djs" style="font-size: 40rpx;">{{countdown}}</cover-view>
				<cover-view v-else class="djs" style="font-size: 30rpx;">{{countdown}}</cover-view>
			</cover-view> -->
			<cover-view @click="myIndex()" v-if="showCountdown" class="float-button">
				<cover-image class="djs-img" src="/static/public/jf.png"></cover-image>
				<cover-view class="djs-time" style="">{{countdown}}</cover-view>
			</cover-view>
			<!-- 顶部图片 -->
			<view class="top-img">
				<image class="ui-img" src="/static/public/blogbg.png" mode="aspectFill"></image>
				<text v-if="share == 0" @click="back()" class="cuIcon-back backbut"></text>
				<text v-else @click="home()" class="cuIcon-home backbut"></text>
			</view>
			<!-- 标题 -->
			<view class="titel-h-w">
				<view class="titel-h">
					{{blogInfo.title}}
				</view>
			</view>

			<!-- 时间和装饰品 -->
			<view class="time-view">
				<view class="time-img">
					<image class="ui-img" src="/static/public/time.svg" mode="aspectFit"></image>
				</view>
				<view class="time-font">
					{{blogInfo.createTime}}
				</view>
			</view>

			<view v-if="!isAdShow">
				<!-- 正文内容 -->
				<view class="data-view">
					<!-- <mp-html class="ql-editor" :tag-style="tag_style" :content="contentDate"
						:container-style="container_style" selectable="true"> </mp-html> -->
						<view style="border: 1px solid #ffffff" class="ql-container ql-snow">
							<rich-text :nodes="contentDate" class="ql-editor"></rich-text>
						</view>
				</view>
				<!-- 猜你想搜 -->
				<view class="titel-felx">
					<view class="time-img">
						<image class="ui-img" src="/static/public/love.svg" mode=""></image>
					</view>
					<view class="titel-h-go">
						猜你想搜
					</view>
				</view>
				<block>
					<view class="list-li" v-for="(item ,index) in blogList" :key="index" @click="to(item.id)">
						<view class="list-img">
							<image class="ui-img" :src="baseUrl+item.showImg"></image>
						</view>
						<view class="list-li-left">
							<view class="list-li-left-h">
								{{item.title}}
							</view>
							<view class="list-li-left-describe">
								<view class="">推选阅读</view>
								<view>{{item.createTime}}</view>
							</view>
						</view>
					</view>
				</block>
			</view>
			<view v-else class="margin">
				<!-- <view style="width: 100%;height: 300rpx;">
					<image class="blog-showimg" :src="blogInfo.showImg"></image>
				</view> -->
				<view v-if="blogInfo.remark" class="shuoming">说明:{{blogInfo.remark}}</view>
				<view v-else class="shuoming">说明：请先点击下方按钮即可获取文章详情，由于存储与服务器成本很高不得已部分内容需您观看激励视频广告</view>
			</view>
			<view v-if="adUnitId" style="width: 90%; margin-top: 30rpx;margin-left: 5%;">
				<ad-custom :unit-id="adUnitId" ad-intervals="30"></ad-custom>
			</view>

			<!-- 支撑顶部高度 -->
			<view style="height: 140upx;"></view>
			<!-- 提问转发 -->
			<view class="cove-bom">
				<view v-if="!isAdShow" class="cover-list-view">
					<!-- <view class="cover-quest">
						提交问题
					</view> -->
					<view @click="showToast()" class="cover-list-btn">
						<view class="cover-list-icon">
							<image class="ui-img" src="/static/public/dianzan.svg"
								mode="aspectFit">
							</image>
						</view>
						<view class="cover-list-font">点赞</view>
					</view>

					<view v-if="blogInfo.appResourceId" @click="download(blogInfo.appResourceId)">
						<view class="cover-list-icon">
							<image class="ui-img" src="/static/public/xiazai.svg"
								mode="aspectFit">
							</image>
						</view>
						<view class="cover-list-font">资源下载</view>
					</view>

					<button class="cover-list-btn" open-type="share">
						<view class="cover-list-icon" style="height: 56upx;">
							<image class="ui-img" src="/static/public/fenxiang.svg"
								mode="aspectFit">
							</image>
						</view>
						<view class="cover-list-font">分享</view>
					</button>
				</view>
				<view v-else>
					<view @click="lookAd()" class="blog-ad">
						广告获取
					</view>
				</view>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>

	</view>
</template>

<script>
	import mpHtml from '@/components/mp-html/mp-html';
	import {
		getArticle,
		listArticle,
		zan,
		lookAddNumber,
		addAppIntegra,
		addIsAppIntegra
	} from "@/api/app/index.js"
	import config from '@/config'
	let videoAd = null;
	export default {
		components: {
			mpHtml
		},
		data() {
			return {
				baseUrl: config.baseUrl,
				adUnitId: "",
				adUnitId2: "",
				id: null,
				userid: null,
				share: 0,
				// 文本框解析
				contentDate: "",
				blogInfo: {},
				blogList: [],
				tag_style: {
					h1: 'line-height: 50px;font-size:16px;',
					h2: 'line-height: 50px;font-size:16px',
					h3: 'line-height: 50px;font-size:16px',
					h4: 'line-height: 50px;font-size:16px',
				},
				container_style: 'font-size:15px;overflow-x: hidden;line-height:30px;letter-spacing:1px',
				isAdShow: false,
				//30浏览加积分定时器
				timer: null,
				showCountdown: false,
				//悬浮球内容
				countdown: "奖励：30",
				timeEnd: true
			}
		},
		// 分享好友配置
		onShareAppMessage(res) {
			var that = this;
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
				addAppIntegra({
					source: '文章分享',
					userId: this.userid
				}).then(response => {

				})
			}
			return {
				title: that.blogInfo.title,
				imageUrl: that.blogInfo.showImg,
				path: 'pages/blog/bloginfo?id=' + that.blogInfo.id + "&share=1",
			}
		},
		onShareTimeline() {
			var that = this;
			return {
				title: that.blogInfo.title,
				query: {
					id: that.blogInfo.id,
					share: 1
				},
				imageUrl: that.blogInfo.showImg
			}
		},
		onLoad(option) {
			this.adUnitId = uni.getStorageSync("sysSet").wzinfoAd
			this.adUnitId2 = uni.getStorageSync("sysSet").downVideoAd
			this.userid = uni.getStorageSync("userInfo").userId
			if (this.userid) {
				addIsAppIntegra({
					source: '文章浏览',
					userId: this.userid
				}).then(response => {
					if(response.msg === "200"){
						this.showCountdown = true
						this.startCountdown(30); // 30秒倒计时
					}
				})
				
			}
			this.id = option.id
			// 是否来自分享页面
			if (option.share) {
				this.share = option.share
			}
			// 请求自定义接口
			this.posdData();
			//推荐文章
			this.getBlogList();
			//新增浏览次数/积分
			this.lookAdd();
			//初始化激励广告
			this.CreateAd()
		},
		onUnload() {
			//卸载定时器
			if (this.timer) {
				clearInterval(this.timer);
			}
		},
		methods: {
			lookAd() {
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
			home() {
				uni.switchTab({
					url: '/pages/index'
				});
			},
			lookAdd() {
				lookAddNumber({
					id: this.id
				}).then(response => {})
			},
			to(id) {
				this.$tab.navigateTo('/pages/blog/bloginfo?id=' + id)
			},
			getBlogList() {
				var that = this;
				listArticle({
					isRecommendation: 0
				}).then(response => {
					that.blogList = response.rows
				})
			},
			// 文章数据
			posdData: function(pass) {
				var that = this;
				getArticle(that.id).then(response => {
					that.blogInfo = response.data
					console.log(that.blogInfo.contentInfo)
					var str = that.blogInfo.contentInfo
					if (str.includes("/dev-api")) {
					 that.blogInfo.contentInfo = str.replaceAll("/dev-api", that.baseUrl)
					} else {
					  that.blogInfo.contentInfo = str.replaceAll("/prod-api", that.baseUrl)
					}
					
					//判断是否需要看广告
					if (that.blogInfo.isAd == 0) {
						that.isAdShow = true
					}
					that.contentDate = response.data.contentInfo
						.replace(/<h1([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<h1')
						.replace(/<h1([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<h1')
						.replace(/<h1>/ig, '<h1 class="h1">')

						.replace(/<h2([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<h2')
						.replace(/<h2([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<h2')
						.replace(/<h2>/ig, '<h2 class="h2">')

						.replace(/<h3([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<h3')
						.replace(/<h3([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<h3')
						.replace(/<h3>/ig, '<h3 class="h3">')

						.replace(/<h4([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<h4')
						.replace(/<h4([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<h4')
						.replace(/<h4>/ig, '<h4 class="h4">')

						.replace(/<h5([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<h5')
						.replace(/<h5([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<h5')
						.replace(/<h5>/ig, '<h5 class="h4">')

						.replace(/<h6([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<h6')
						.replace(/<h6([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<h6')
						.replace(/<h6>/ig, '<h6 class="h6">')

						.replace(/<code([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<code')
						.replace(/<code([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<code')
						.replace(/<code>/ig, '<code class="language-css">')
				})

			},
			showToast() {
				zan({
					id: this.id
				}).then(response => {
					this.$refs.uToast.show({
						type: 'success',
						title: '',
						message: "╮(๑•́ ₃•̀๑)╭ 谢谢您 ",
						icon: false
					})
				})
			},
			download(id) {
				this.$tab.navigateTo('/pages/blog/resource?id=' + id + "&type=1")
			},
			back(val) {
				uni.navigateBack()
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
								this.$refs.uToast.show({
									type: 'success',
									title: '',
									message: "╮(๑•́ ₃•̀๑)╭ 获取成功",
									icon: false
								})
								that.isAdShow = false
							} else {
								
							}
						})
					}

				}
			},
			// 开始倒计时
			startCountdown(seconds) {
				var that = this
				let countdownSeconds = seconds;
				this.timer = setInterval(() => {
					countdownSeconds--;
					this.countdown ="奖励："+ countdownSeconds+" S";
					if (countdownSeconds === 0) {
						addAppIntegra({
							source: '文章浏览',
							userId: that.userid
						}).then(response => {
							that.timeEnd = false
							that.countdown = "奖励："+ response.msg
						})
						if (this.timer) {
							clearInterval(this.timer);
							this.timer = null;
						}
					}
				}, 1000);
			},
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #ffffff;
		min-height: 100%;
		height: auto;
	}

	.djs {
		width: 100rpx;
		height: 100rpx;
		color: black;
		border-radius: 100rpx;
		text-align: center;
		line-height: 100rpx;
		z-index: 1000;
	}
	.djs-img {
		position: absolute;
		width: 90rpx;
		height: 90rpx;
	}
	.djs-time{
		font-size: 14rpx;
		position: relative;
		top: 75rpx;
		color: #fff;
		height: 29rpx;
		width: 90rpx;
		line-height: 29rpx;
		background-color: #FC7F2C;
		border-radius: 17rpx;
		text-align: center;
	}

	.container {
		height: 100%;
		position: relative;
	}

	.float-button {
		position: fixed;
		left: 20px;
		height: 150rpx;
		width: 150rpx;
		bottom: 600px;
		z-index: 99;
		background-size: 100% 100%;
	}

	.blog-ad {
		height: 100rpx;
		width: 90%;
		margin-left: 5%;
		margin-bottom: 40rpx;
		border-radius: 100rpx;
		background: #7a60fd;
		position: absolute;
		bottom: 0;
		/* 将按钮固定在容器的底部 */
		line-height: 100rpx;
		text-align: center;
		font-size: 38rpx;
		color: white;
	}

	.shuoming {
		margin: 25rpx 0 25rpx 0;
		font-size: 26rpx;
		background-color: #fff9d7;
		line-height: 45rpx;
		text-align: ;
		border-radius: 20rpx;
		color: orange;
		padding: 40rpx;
	}

	.backbut {
		position: absolute;
		left: 20rpx;
		top: 100rpx;
		font-size: 50rpx;
	}

	.time-img {
		height: 50rpx;
		width: 50rpx;
	}

	.titel-felx {
		display: flex;
		align-items: center;
		padding: 28upx;
		border-radius: 20upx;
	}

	.titel-h-go {
		font-size: 32upx;
		margin-left: 20upx;
	}

	.top-img {
		height: 500upx;
		width: 100%;
	}

	.ui-img {
		height: 100%;
		width: 100%;
	}

	.blog-showimg {
		border-radius: 30rpx;
		height: 100%;
		width: 100%;
	}

	/* 标题 */
	.titel-h {
		font-size: 42upx;
		font-weight: bold;
	}

	.titel-h-w {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 70upx 30upx 0upx 30upx;
		flex-grow: 1;
	}

	/* 时间 */
	.time-font {
		font-weight: 400;
		font-size: 24upx;
		color: rgba(124, 124, 124, 1);
		margin-left: 10upx;
	}


	.time-view {
		margin: 30upx 28upx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.data-view {
		margin: 20upx 20upx;
		font-size: 34upx;
		color: #333232;
		line-height: 60upx;
		word-wrap: break-word;
	}

	.list-li-left-describe {
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		color: #D5D5D5;
		font-size: 20upx;
		display: flex;
		justify-content: space-between;
		margin-bottom: 6rpx;
	}

	.list-li-left-h {
		overflow: hidden;
		height: 70rpx;
		font-size: 26upx;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		margin-top: 10rpx;
	}

	.list-li-left {
		margin-left: 32upx;
		flex-grow: 1;
		height: 145rpx;
		display: flex;
		flex-flow: column;
		justify-content: space-between;
	}

	.list-img {
		height: 140upx;
		width: 200upx;
		border-radius: 14upx;
		overflow: hidden;
		flex-shrink: 0;
	}

	.list-li {
		display: flex;
		margin: 20upx 48upx;
		align-items: center;
		border-radius: 20upx;
	}

	/* 提问转发 */
	.cover-list-icon {
		height: 64upx;
		width: 64upx;
		display: block;
		margin: auto;
	}

	.cover-list-btn {
		margin: 0upx;
		padding: 0upx;
		background-color: unset;
		line-height: unset;
	}

	button::after {
		border: none;
	}

	.cover-list-font {
		color: #b2b2b2;
		font-size: 24upx;
		text-align: center;
		/* margin-top: 16upx; */
	}

	.cover-open-right-bot {
		width: 100%;
		height: 100%;
		transform: rotate(180deg);
	}

	.cover-open-right-up {
		width: 100%;
		height: 100%;
	}

	.cover-open-right {
		position: absolute;
		right: 44upx;
		height: 32upx;
		width: 32upx;
	}

	.cover-quest {
		border-radius: 100upx;
		height: 74upx;
		line-height: 74upx;
		width: 24%;
		background-color: #f3f3f3;
		color: #b7b7b7;
		font-size: 24upx;
		padding-left: 40upx;
		margin-top: 20rpx;
	}

	.cover-list-view {
		margin-bottom: 28upx;
		height: 110upx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		overflow: hidden;
	}

	.cover-h-icon {
		height: 50upx;
		width: 50upx;
		overflow: hidden;
		margin-left: 28upx;
		margin-right: 14upx;
	}

	.cover-view-h {
		margin: 28upx 28upx 0upx 28upx;
		color: #FFFFFF;
		height: 80upx;
		font-size: 28upx;
		display: flex;
		align-items: center;

	}

	.cove-bom {
		position: fixed;
		bottom: 0upx;
		left: 0upx;
		width: 100%;
		z-index: 1025;
		background-color: #fff;
	}
</style>