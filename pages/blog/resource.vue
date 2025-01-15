<template>
	<view style="min-height: 100vh;position: relative;">

		<!-- 顶部图片 -->
		<view class="top-img">
			<image class="ui-img" src="/static/public/blogbg.png" mode="aspectFill"></image>
			<text @click="back()" class="cuIcon-back backbut"></text>
		</view>
		<view class="resource-box">
			<view class="resource-view">
				<view class="resource-img">
					<image class="ui-img" src="/static/public/xiazai.svg" mode="aspectFit"></image>
				</view>
				<view class="resource-font">
					{{resourceInfo.resourceTitle}}
				</view>
			</view>
			
			<view class="resource-list">
				<view v-if="type != 1" class="resource-view">
					<view class="resource-img2">
						<image class="ui-img" src="/static/public/shuoming.svg" mode="aspectFit"></image>
					</view>
					<view class="resource-font2">
						下载说明
					</view>
				</view>
				<view v-if="type != 1" class="data-view">
					<view style="border: 1px solid #ffffff" class="ql-container ql-snow">
						<rich-text :nodes="contentDate" class="ql-editor"></rich-text>
					</view>
					<!-- <mp-html  class="ql-editor" :tag-style="tag_style" :content="contentDate" :container-style="container_style"
						selectable="true"> </mp-html> -->
				</view>
				
				<!-- 资源列表 -->
				<view>
					<view class="resource-view">
						<view class="resource-img2">
							<image class="ui-img" src="/static/public/wenjian.svg" mode="aspectFit"></image>
						</view>
						<view class="resource-font2">
							资源列表
						</view>
					</view>
					<view v-if="isLookAd == 0" class="shuoming2">复制下方链接打开手机浏览器进行下载！！！</view>
					<view v-else class="shuoming2">请先点击下方按钮即可获取资源下载列表！</view>
					<view v-if="isLookAd == 0" v-for="(item,index) in resourceInfo.appResourceListList" :key="index" class="file-list">
						<view class="resource-view">
							<view class="resource-img3">
								<image class="ui-img" src="/static/public/files.svg" mode="aspectFit"></image>
							</view>
							<view class="resource-font3">
								{{item.listName}}<text class="password" v-if="item.password != '' && item.password != null"> 密码：{{item.password}} </text>
							</view>
						</view>
						<view class="file-url-box"><text class="file-url">{{item.listUrl}}</text><text @click="copy(item.listUrl)" class="file-copy">复制</text></view>
					</view>
					
					<view v-if="adUnitId" style="width: 100%; margin-top: 50rpx;">
						<ad-custom :unit-id="adUnitId"  ad-intervals="30" ></ad-custom>
					</view>
					
				</view>
				
			</view>
		</view>
		<view v-if="isLookAd ==1 || isLookAd == 2" style="height: 140rpx; width: 100%;"></view>
		<view v-if="isLookAd ==1" @click="lookAd()" class="resource-ad">
			广告查看
		</view>
		<view v-if="isLookAd ==2" @click="jfAd()" class="resource-ad">
			积分获取（ {{resourceInfo.adNumber}} 积分 ）
		</view>
		<u-toast ref="uToast"></u-toast>

	</view>
</template>

<script>
	import {
		getResource,resourceDownLoad,appGetUserById,exchangeResource
	} from "@/api/app/index.js"
	import config from '@/config'
	let videoAd = null;
	export default {
		data() {
			return {
				baseUrl: config.baseUrl,
				adUnitId:"",
				adUnitId2:"",
				id:null,
				resourceInfo:{},
				isLookAd:null,
				tag_style: {
					h1: 'line-height: 50px;font-size:16px;',
					h2: 'line-height: 50px;font-size:16px',
					h3: 'line-height: 50px;font-size:16px',
					h4: 'line-height: 50px;font-size:16px',
				},
				container_style: 'font-size:15px;overflow-x: hidden;line-height:30px;letter-spacing:1px',
				contentDate: "",
				userId: null,
				type:0
			}
		},
		// 分享好友配置
		onShareAppMessage(res) {
			var that = this;
			return {
				title: that.resourceInfo.resourceTitle,
				imageUrl: that.resourceInfo.showImg,
				path: 'pages/blog/resource?id='+that.resourceInfo.id+"&share=1",
			}
		},
		onShareTimeline(){
			var that = this;
		    return {
		      title:that.resourceInfo.resourceTitle,
		      query:{
				  id: that.resourceInfo.id,
				  share: 1
		      },
		      imageUrl:that.resourceInfo.showImg
		    }
		},
		onLoad(option) {
			this.adUnitId = uni.getStorageSync("sysSet").zyinfoAd
			this.adUnitId2 = uni.getStorageSync("sysSet").downVideoAd
			this.userId = uni.getStorageSync("userInfo").userId
			this.id = option.id
			if(option.type){
				this.type = option.type
			}
			// 请求详情
			this.getInfo()
			//初始化激励广告
			this.CreateAd()
		},
		methods: {
			CreateAd(){
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
								// that.$refs.uToast.show({
								// 	type: 'success',
								// 	title: '',
								// 	message: "╮(๑•́ ₃•̀๑)╭ 谢谢您的支持 ",
								// 	icon: false
								// })
								that.isLookAd = 0
								resourceDownLoad({id: that.id}).then(response => {})
							} else {
								
							}
						})
					}
				
				}
			},
			jfAd(){
				var that = this;
				appGetUserById(that.userId).then(response => {
					if (that.resourceInfo.adNumber > response.user.integral) {
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
							source: '资源兑换',
							isAdd: 1,
							integralNumber: that.resourceInfo.adNumber,
							userId: that.userId,
						}
						exchangeResource(data).then(response => {
							that.$refs.uToast.show({
								type: 'success',
								title: '',
								message: "兑换成功",
								icon: false
							})
							that.isLookAd = 0
						})
					}
				
				
				})
			},
			lookAd(){
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
				
				//下载次数+1
				//添加广告记录
			},
			getInfo(){
				var that = this;
				getResource(this.id).then(response => {
					if(response.data.isAd == 0){
						this.isLookAd = 0
						resourceDownLoad({id: this.id}).then(response => {})
					}else if(response.data.isAd == 1){
						this.isLookAd = 1
						//resourceDownLoad({id: this.id}).then(response => {})
					}else{
						this.isLookAd = 2
						
					}
					that.resourceInfo = response.data
					var str = that.resourceInfo.explain
					if (str.includes("/dev-api")) {
					 that.resourceInfo.explain = str.replaceAll("/dev-api", that.baseUrl)
					} else {
					  that.resourceInfo.explain = str.replaceAll("/prod-api", that.baseUrl)
					}
					that.contentDate = response.data.explain
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
			copy(url){
				var that = this;
				uni.setClipboardData({
					data: url,
					showToast: false,
					success: function () {
						
					}
				});
			},
			back(){
				//this.$tab.redirectTo('/pages/blog/bloginfo')
				uni.navigateBack()
			}

		}
	}
</script>

<style>
	page {
		background-color: #ffffff;
		min-height: 100%;
	}
	.password{
		font-size: 24rpx;
		color: #4a4a4a;
		margin-left: 40rpx;
	}
	.data-view {
		margin: 0upx 20upx;
		font-size: 34upx;
		color: #333232;
		line-height: 60upx;
		word-wrap: break-word;
	}
	
	.jiesao{
		padding: 20rpx 30rpx;
	}
	.resource-ad{
		height: 100rpx;
		width: 90%;
		margin-left: 5%;
		margin-bottom: 40rpx;
		border-radius: 100rpx;
		background: #7a60fd;
		position: absolute;
		bottom: 0; /* 将按钮固定在容器的底部 */
		line-height: 100rpx;
		text-align: center;
		font-size: 38rpx;
		color: white;
	}
	.file-list{
		margin: 30rpx;
	}
	.file-url-box{
		background: #dcdcdc;
		height: 80rpx;
		width: 100%;
		border-radius: 20rpx;
		margin-top: 20rpx;
		line-height: 80rpx;
		
	}
	.file-url{
		float: left;
		margin-left: 40rpx;
		  white-space: nowrap; /* 防止文本换行 */
		  overflow: hidden; /* 隐藏超出容器的内容 */
		  text-overflow: ellipsis; /* 当文本溢出时显示省略号 */
		  /* 你还需要设置容器的宽度，以便知道何时文本应该溢出 */
		  width: 450rpx; /* 或者其他你需要的宽度 */
	}
	.file-copy{
		float: right;
		margin-right: 40rpx;
	}
	.shuoming{
		margin: 25rpx 25rpx 30rpx 25rpx;
		font-size: 25rpx;
	}
	.shuoming2{
		margin: 25rpx 35rpx 30rpx 35rpx;
		font-size: 26rpx;
		background-color: #fff9d7;
		height: 85rpx;
		line-height: 85rpx;
		text-align: center;
		border-radius: 20rpx;
		color: orange;
	}
	.resource-list{
		margin: 40rpx 20rpx;
	}
	
	.resource-font {
		font-weight: 600;
		font-size: 35rpx;
		margin-left: 20rpx;
	}
	.resource-view {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	.resource-img {
		height: 60rpx;
		width: 60rpx;
	}
	.resource-font3 {
		font-weight: 400;
		font-size: 25rpx;
		margin-left: 15rpx;
	}
	.resource-img3 {
		height: 30rpx;
		width: 30rpx;
	}
	.resource-font2 {
		font-weight: 600;
		font-size: 30rpx;
		margin-left: 20rpx;
	}
	.resource-img2 {
		height: 45rpx;
		width: 45rpx;
	}
	
	.resource-box{
		min-height: 350rpx;
		width: 100%;
		background-color: white;
		border-radius: 50rpx;
		margin-top: -60rpx;
		position: relative;
		z-index: 2;
		padding: 50rpx 30rpx;
	}

	.top-img {
		height: 500upx;
		width: 100%;
		position: relative;
		z-index: 1;
	}

	.ui-img {
		height: 100%;
		width: 100%;
		position: relative;
	}

	.backbut {
		position: absolute;
		left: 20rpx;
		top: 100rpx;
		font-size: 50rpx;
	}
</style>