<template>
	<view class="my">
		<image src="/static/mine/my-bg4.png" mode="aspectFill" class="my_bg"></image>
		<view class="header_cell">
			<view style="margin-top: 40rpx;" class="user_info">
				<view class="flex justify-center align-center">
					<image src="https://i.imgtg.com/2022/12/15/DsNJF.jpg" mode="aspectFill" class="user_photo"></image>
					<view>
						<view class="text-black text-bold">
							<text v-if="userid" class="text-xl" style="font-weight: bold;">微信用户_{{userid}}</text>
							<text v-else class="text-xl" style="font-weight: bold;">游客用户！</text>
							<text v-if="!userid" class="cu-tag round bg-red" style="margin-left: 20rpx;">未登录</text>
						</view>

					</view>
				</view>
				<!-- <text class="lg text-gray cuIcon-right" @click="handleToSetting"></text> -->
				
			</view>
			<text v-if="userid" style="float: right;" class="lg text-gray cuIcon-repair" @click="clean"></text>
			<view v-if="!userid" class="auth_btn">
				<button @tap="autologin()" class="cu-btn round bg-black">
					<text class="lg text-white cuIcon-weixin" style="margin-right: 20rpx;"></text>
					授权登录
				</button>
			</view>

			<view style="margin-top: 90rpx;" class="vip_cell flex justify-between align-center">
				<view>
					<view class="text-xl" style="font-weight: bold;color: rgb(241, 198, 142);">
						{{myIntegral}} 积分
						<text class="lg cuIcon-vip" style="margin-left: 15rpx;"></text>
					</view>
					<view class="text-xs" style="margin-top: 10rpx;font-size: 21rpx;">每邀请一个新用户登录，奖励 {{newUserNumber}} 个积分</view>
					<!-- <view v-else class="text-xs" style="margin-top: 10rpx;font-size: 23rpx;">授权登录后才可获得积分奖励哦</view> -->
				</view>
				<button open-type="share" class="cu-btn round invate_btn">邀 请</button>
			</view>
		</view>
		<!-- <view class="cell_1 flex justify-around align-center bg-white mt30" style="padding: 30rpx 0;border-radius: 15rpx;text-align: center;">
			广告位 
		</view> -->
		<view class="cell_2 flex  align-center mt30">
			<button @click="guanzhu(1)" class="kefu">
				<text style="color: #ff973c;font-size: 60rpx;" class=" cuIcon-appreciatefill"></text>
				<text style="display: block;margin-top: -60rpx;margin-bottom: 15rpx;font-size: 30rpx;">关注我们</text>
			</button>
			<button open-type="contact" class="kefu">
				<text style="color: #1382ff;font-size: 60rpx;" class=" cuIcon-servicefill"></text>
				<text style="display: block;margin-top: -60rpx;margin-bottom: 15rpx;font-size: 30rpx;">联系我们</text>
			</button>
		</view>
		<!-- <view style="width: 100%; margin-top: 30rpx;">
			<ad-custom unit-id="adunit-ff28399b17818338"  ad-intervals="30" ></ad-custom>
		</view> -->
		<view class="mt30 grid text-center col-4 bg-white"
			style="padding: 30rpx 0; border-radius: 15rpx;row-gap: 30rpx;">
			<view @click="exchange()">
				<view class="cell_3_icon flex justify-center align-center"><text
						class="text-olive cuIcon-choiceness"></text></view>
				<view>积分兑换</view>
			</view>
			<view @click="exchangeRecords()">
				<view class="cell_3_icon flex justify-center align-center"><text
						class="text-cyan cuIcon-selection"></text></view>
				<view>兑换记录</view>
			</view>
			<view @click="integralRecord()">
				<view class="cell_3_icon flex justify-center align-center"><text class="text-cyan cuIcon-coin"></text>
				</view>
				<view>积分记录</view>
			</view>
			<view @click="mzModalShow()">
				<view class="cell_3_icon flex justify-center align-center"><text
						class="text-olive cuIcon-creative"></text></view>
				<view>免责声明</view>
			</view>
		</view>
		
		<!-- 功能列表 -->
		<view class="metergasis">
			<view class="metergasis-li" hover-class="fengrui-li-hover" @tap="Signin()">
				<view class="metergasis-li-img">
					<image class="blogui-img" src="/static/mine/qiandao.svg" mode="aspectFill">
					</image>
				</view>
				<view class="metergasis-li-h">
					每日签到
				</view>
				<text v-if="isSignin == true" class="metergasis-li-h2">可获得 {{signinIntegral}} 积分</text>
				<text v-if="isSignin == false" v-esle class="metergasis-li-h2">今日已签到</text>
				<view class="metergasis-li-rgth">

					<image class="blogui-img" src="/static/mine/more.svg" mode=""></image>
				</view>
			</view>

			<view class="metergasis-li" hover-class="fengrui-li-hover" @tap="categoryNew()">
				<view class="metergasis-li-img">
					<image class="blogui-img" src="/static/mine/wenzhang.svg" mode="aspectFill">
					</image>
				</view>
				<view class="metergasis-li-h">
					浏览文章
				</view>
				<text class="metergasis-li-h2">每次获得 {{articleIntegral}} 积分 ( {{articleYesNumber}}/{{articleNumber}} )</text>
				<view class="metergasis-li-rgth">
					<image class="blogui-img" src="/static/mine/more.svg" mode=""></image>
				</view>
			</view>
			<view class="metergasis-li" hover-class="fengrui-li-hover" @tap="categoryNew()">
				<view class="metergasis-li-img">
					<image class="blogui-img" src="/static/mine/weixin.svg" mode="aspectFill">
					</image>
				</view>
				<view class="metergasis-li-h">
					分享文章
				</view>
				<text class="metergasis-li-h2">每次获得 {{shareIntegral}} 积分 ( {{shareYesNumber}}/{{shareNumber}} )</text>
				<view class="metergasis-li-rgth">
					<image class="blogui-img" src="/static/mine/more.svg" mode=""></image>
				</view>
			</view>

			<view class="metergasis-li" hover-class="fengrui-li-hover" @tap="lookAd()">
				<view class="metergasis-li-img">
					<image class="blogui-img" src="/static/mine/ad.svg" mode="aspectFill">
					</image>
				</view>
				<view class="metergasis-li-h">
					观看广告
				</view>
				<text class="metergasis-li-h2">每次获得 {{adIntegral}} 积分 ( {{adYesNumber}}/{{adNumber}} )</text>
				<view class="metergasis-li-rgth">
					<image class="blogui-img" src="/static/mine/more.svg" mode=""></image>
				</view>
			</view>
			<view class="metergasis-li" hover-class="fengrui-li-hover" @tap="guanzhu(2)">
				<view style="width: 55rpx; height: 55rpx;" class="metergasis-li-img">
					<image class="blogui-img" src="/static/mine/adduser.svg" mode="aspectFill">
					</image>
				</view>
				<view style="margin-left: 27rpx;" class="metergasis-li-h">
					添加好友
				</view>
				<text class="metergasis-li-h2">添加成功可获得 {{addUserNumber}} 积分</text>
				<view class="metergasis-li-rgth">
					<image class="blogui-img" src="/static/mine/more.svg" mode=""></image>
				</view>
			</view>
			<view class="metergasis-li" hover-class="fengrui-li-hover" @tap="lottery()">
				<view class="metergasis-li-img">
					<image class="blogui-img" src="http://imgs.emoboy.vip/static/mine/choujiang.svg" mode="aspectFill"></image>
				</view>
				<view class="metergasis-li-h">
					参与抽奖 
				</view>
				<text class="metergasis-li-h2">可随机获得积分及奖励</text>
				<view class="metergasis-li-rgth">
					<image class="blogui-img" src="http://imgs.emoboy.vip/static/mine/more.svg" mode=""></image>
				</view>
			</view>
		</view>
		<!--免责声明弹窗-->
		<view class="cu-modal" :class="modalName=='mzModal'?'show':''">
			<view style="border-radius: 30rpx;" class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view style="color: black;font-size: 38rpx;margin-top: 50rpx;" class="content">声明</view>
				</view>
				<view class=" bg-white">
					<view style="font-size: 33rpx;color: #6a6a6a;padding: 40rpx 60rpx 60rpx 60rpx;">
						创作者上传至《依沫博客》小程序的素材内容由创作者负责，部分来源于网络和他处购买如有侵权，请在界面中的联系我们进行删除处理 !
					</view>

					<button @tap="hideModal" style="margin-bottom: 50rpx;width: 55%;height: 90rpx;font-size: 38rpx;"
						class="cu-btn bg-green">确认</button>
				</view>
			</view>
		</view>
		<view class="no-list-data" >
			-- 温馨提示 --
		</view>
		<view class="no-list-data2" >
			小程序数据全过程可回溯，若利用技术手段，bug等非法操作获取的积分包括任何数据都将会视作无效，情节严重将追究其法律责任，请大家合法上网，感谢配合
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		autoLoginWx,
		wxLogin,
		getUser,
		addAppIntegra
	} from "@/api/app/index.js"
	import {
		setToken,
		getToken
	} from '@/utils/auth'
	let videoAd = null;
	export default {
		data() {
			return {
				adUnitId:"",
				modalName: null,
				name: this.$store.state.user.name,
				userid: null,
				myIntegral: 0,
				signinIntegral: 0,
				isSignin: true,
				articleIntegral: 0,
				articleYesNumber: 0,
				articleNumber: 0,
				shareIntegral: 0,
				shareYesNumber: 0,
				shareNumber: 0,
				adIntegral: 0,
				adYesNumber: 0,
				adNumber: 0,
				newUserNumber: 0,
				addUserNumber: 0
			};
		},
		// 分享好友配置
		onShareAppMessage(res) {
			var that = this;
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: "依沫资源,有你想要的",
				imageUrl: "",
				path: 'pages/index?userid='+this.userid,
			}
		},
		onShareTimeline(){
		    return {
		      title:'依沫资源,有你想要的',
		      query:{
		      },
		      imageUrl:''
		    }
		},
		onShow() {
			this.userid = uni.getStorageSync("userInfo").userId
			console.log("用户信息：" + this.userid)
			if (this.userid) {
				this.getUserInfo()
			}
		},
		onLoad() {
			//初始化激励广告
			this.adUnitId = uni.getStorageSync("sysSet").adVideoAd
			this.CreateAd()
		},
		methods: {
			lottery(){
				this.$tab.navigateTo('/pages/mine/lottery')
			},
			CreateAd(){
				var that = this;
				if (this.adUnitId != '') {
					if (wx.createRewardedVideoAd) {
						videoAd = wx.createRewardedVideoAd({
							adUnitId: this.adUnitId
						})
						videoAd.onLoad(() => {
						})
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
								that.$refs.uToast.show({
									type: 'success',
									title: '',
									message: "╮(๑•́ ₃•̀๑)╭  积分+ "+that.adIntegral,
									icon: false
								})
								addAppIntegra({
									source: '广告任务',
									userId: that.userid
								}).then(response => {
									that.getUserInfo()
								})
							} else {
								that.$refs.uToast.show({
									type: 'success',
									title: '',
									message: "看完才能获得奖励哟！",
									icon: false
								})
								
							}
						})
					}
				
				}
			},
			exchangeRecords(){
				var that = this
				if (!this.userid) {
					that.$refs.uToast.show({
						type: 'success',
						title: '',
						message: "请先授权登录",
						icon: false
					})
				}else{
					this.$tab.navigateTo('/pages/mine/exchange_records')
				}
			},
			exchange(){
				this.$tab.navigateTo('/pages/tool/exchange')
			},
			categoryNew(){
				uni.switchTab({
					url: '/pages/search/index'
				});
			},
			integralRecord(){
				var that = this
				if (!this.userid) {
					that.$refs.uToast.show({
						type: 'success',
						title: '',
						message: "请先授权登录",
						icon: false
					})
				}else{
					this.$tab.navigateTo('/pages/mine/integral_record')
				}
				
			},
			Signin() {
				var that = this
				if (!this.userid) {
					that.$refs.uToast.show({
						type: 'success',
						title: '',
						message: "请先授权登录",
						icon: false
					})
				}else{
					if(this.isSignin){
						
						addAppIntegra({
							source: '签到',
							userId: this.userid
						}).then(response => {
							that.$refs.uToast.show({
								type: 'success',
								title: '',
								message: "╮(๑•́ ₃•̀๑)╭ 签到成功 ",
								icon: false
							})
							that.getUserInfo()
						})
					}
				}
			},
			lookAd() {
				var that = this
				if (!this.userid) {
					that.$refs.uToast.show({
						type: 'success',
						title: '',
						message: "登录后可获得积分",
						icon: false
					})
				}else{
					if(that.adYesNumber >= that.adNumber){
						that.$refs.uToast.show({
							type: 'success',
							title: '',
							message: "今日次数已使用完！",
							icon: false
						})
						return;
					}
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
					
				}
				
			},
			getUserInfo() {
				var that = this;
				getUser(this.userid).then(response => {
					that.articleYesNumber = 0
					that.shareYesNumber = 0
					that.adYesNumber = 0
					that.isSignin = true
					for(var i=0; i<response.integral.length; i++){
						if(response.integral[i].source === '文章浏览'){
							that.articleYesNumber++;
						}else if(response.integral[i].source === '文章分享'){
							that.shareYesNumber++
						}else if(response.integral[i].source === '广告任务'){
							that.adYesNumber++
						}else if(response.integral[i].source === '签到'){
							that.isSignin = false
						}
					}
					that.signinIntegral = response.signin.split(",")[0]
					that.myIntegral = response.user.integral
					that.articleIntegral = response.article.split(",")[0]
					that.articleNumber = response.article.split(",")[1]
					that.shareIntegral = response.share.split(",")[0]
					that.shareNumber = response.share.split(",")[1]
					that.adIntegral = response.ad.split(",")[0]
					that.adNumber = response.ad.split(",")[1]
					that.newUserNumber = response.newUserNumber
					that.addUserNumber = response.addUserNumber
				})
			},
			autologin() {
				let that = this;
				//获取code
				uni.login({
					provider: 'weixin',
					success: loginRes => {
						//获取openid
						autoLoginWx(loginRes.code).then(response => {
							var antoInfo = JSON.parse(response.msg)
							//登录
							wxLogin({
								openId: antoInfo.openid
							}).then(logininfo => {
								setToken(logininfo.token)
								//设置用户信息
								this.$store.dispatch('GetInfo').then(res => {
									that.userid = uni.getStorageSync("userInfo").userId
									that.getUserInfo()
								})
							})
						})

					}
				});
			},
			mzModalShow() {
				this.modalName = "mzModal"
			},
			hideModal() {
				this.modalName = null
			},
			guanzhu(type) {
				this.$tab.navigateTo('/pages/mine/guanzhu?type='+type)
			},
			handleToSetting() {
				this.$store.dispatch('LogOut').then(() => {
					this.$tab.reLaunch('/pages/index')
				})
			},
			blogInfo(val) {
				this.$tab.navigateTo('/pages/blog/bloginfo')
			},
			clean(){
				uni.removeStorageSync('isIndexModal');
				this.$refs.uToast.show({
					type: 'success',
					title: '',
					message: "清理成功",
					icon: false
				})
			}
		}
	};
</script>

<style lang="less" scoped>
	.kefu {
		width: 49%;
		background-color: white;
	}
	/* 列表没有数据 */
	.no-list-data {
		text-align: center;
		margin-bottom: 100rpx;
		color: #b3b3b3;
		font-size: 24upx;
		margin: 40rpx 40rpx 0rpx 40rpx;
	}
	.no-list-data2 {
		text-align: center;
		margin-bottom: 100rpx;
		color: #b3b3b3;
		font-size: 24upx;
		margin: 10rpx 40rpx 40rpx 40rpx;
	}

	button::after {
		border: none;
	}

	.blogui-img {
		height: 100%;
		width: 100%;
	}

	/* 功能列表 */
	.metergasis-li-rgth {
		width: 50upx;
		height: 50upx;
		overflow: hidden;
		flex-shrink: 0;
		position: absolute;
		right: 0upx;
		top: 50%;
		transform: translate(0%, -50%);
	}

	.metergasis-li-h {
		grid-row: 1;
		margin-left: 30upx;
		font-size: 30upx;
	}

	.metergasis-li-h2 {
		grid-row: 1;
		margin-left: 30upx;
		font-size: 25upx;
		color: #ADADAD;
		margin-left: auto;
		margin-right: 10rpx;
	}

	.metergasis-li-img {
		height: 52upx;
		width: 52upx;
		border-radius: 100upx;
		flex-shrink: 0;
	}

	.metergasis-li {
		padding: 24upx 32upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}

	.metergasis {
		background-color: #FFFFFF;
		border-radius: 16upx;
		margin: 2upx 0upx;
		padding: 2upx;
		margin-top: 30rpx;
	}

	.my {
		padding: 30rpx;

		.mt30 {
			margin-top: 30rpx;
		}

		.my_bg {
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
			width: 100%;
		}

		.header_cell {
			margin-top: 100rpx;

			.user_info {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.user_photo {
					width: 120rpx;
					height: 120rpx;
					box-shadow: 0px 0px 10rpx 1px rgba(0, 0, 0, 0.1);
					border-radius: 50%;
					background-color: white;
					margin-right: 20rpx;
				}
			}

			.auth_btn {
				margin: 50rpx auto;
				text-align: center;

				&>button {
					box-shadow: 3px 3px 10rpx 1px rgba(0, 0, 0, 0.2);
					padding-left: 50rpx;
					padding-right: 50rpx;
				}
			}

			.vip_cell {
				margin-top: 40rpx;
				width: 690rpx;
				height: 150rpx;
				background-image: url('/static/mine/vip_bg.png');
				background-size: 100% 100%;
				color: white;
				padding: 0 30rpx;

				.invate_btn {
					background-color: rgb(241, 198, 142);
					box-shadow: 3px 3px 10rpx 1px rgba(241, 198, 142, 0.5);
					width: 150rpx;
					color: rgb(99, 71, 56);
					font-weight: bold;
				}
			}
		}

		.cell_1_icon {
			width: 100rpx;
			height: 100rpx;
			background-color: #f4f2f7;
			border-radius: 50%;
			font-size: 50rpx;
			margin: 0 auto;
			margin-bottom: 15rpx;
		}

		.cell_2 {
			&>view {
				background-color: white;
				border-radius: 15rpx;
				text-align: center;
				width: 48%;
				padding: 30rpx 0;
			}

			.cell_2_icon {
				font-size: 60rpx;
				margin-bottom: 15rpx;
			}
		}

		.cell_3_icon {
			font-size: 50rpx;
			margin-bottom: 20rpx;
		}

		.cell_4 {

			&>view,
			navigator {
				padding: 20rpx 0;
			}
		}
	}
</style>