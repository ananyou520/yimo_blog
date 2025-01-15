<template>
	<view style="background-color:#1015F2; height: 1400rpx;">
		<!-- 背景图 -->
		<view class="wh-w750" style=" position: relative;">
			<image :src="nImg" mode="aspectFill"
				style="height: 1338rpx; width: 750rpx;"></image>
		</view>
		<!-- 转盘 -->
		<view class="luck-list"
			style="position: absolute;top: 415rpx;right: 0;left: 72rpx; width: 600rpx;">
			<view v-for="(item,index) in AwardList" :key="index">
				<view class="cell-item" :class="index==4||index===sel?'y-b':'w-b'"
					@tap="begin(index)">
					<view class="cell-content"
						:class="index==4||index===sel?'y':'w'">
						<image :src="item.image" mode="widthFix" style="width: 60rpx; height: 60rpx;" v-if="item.image"></image>
						<view style="margin-top: 5rpx;">
							<text style="font-size: 21rpx; font-weight: bold;">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 背景图
			nImg: String,
			// 列表
			AwardList:{
				type:Array,
				default:[]
			},
			// 中奖索引
			sjNum:{
				type:Number,
				default:0
			},
			// 判断免费抽奖，广告抽奖
			lotteryType:{
				type:Number,
				default:0
			}
		},
		data() {
			return {
				sel: '',
				FastNums: 0,
				SlowNums: 0,
				time: 1000,
				LoopStatus: true,
				noClick: true
			}
		},
		onLoad() {
			
		},
		methods: {
			// 中奖后的逻辑
			updateMoney(sjNum){
				this.$emit('updateMoney',sjNum)
			},
			// 开始抽奖
			begin(index) {
				if(this.lotteryType == 0){
					this.nowBegin(index)
				}else if(this.lotteryType == 1){
					this.$emit('lookAd',index)
				}else if(this.lotteryType == 2){
					this.$emit('noChance')
				}else{
					uni.showToast({
						title: '出错啦 !',
						icon: "none",
						position: 'bottom'
					});
				}
				
			},
			nowBegin(index){
				if (index == 4) {
					if (!this.noClick) {
						uni.showToast({
							title: '请勿频繁点击',
							icon: "none",
							position: 'bottom'
						});
						return
					};
					this.noClick = false;
					this.FastNums = 0
					this.SlowNums = 0
					this.time = 200
					this.LoopStatus = true
					this.loop()
				}
			},
			// 抽奖过程 控制
			loop() {
				let sjNum = this.sjNum
				//console.log(sjNum)
				if (!this.sel || this.sel < 9) {
					if (this.sel == 3) {
						this.sel = 0
					} else if (this.sel === '') {
						this.sel = 0
					} else if (this.sel == 2) {
						this.sel = 5
					} else if (this.sel == 5) {
						this.sel = 8
					} else if (this.sel == 8) {
						this.sel = 7
					} else if (this.sel == 7) {
						this.sel = 6
					} else if (this.sel == 6) {
						this.sel = 3
					} else {
						this.sel++
					}
					this.FastNums++
					if (this.FastNums == 4) {
						this.FastNums = 0
						this.time = 50
						this.SlowNums++
					}
					if (this.SlowNums == 8) {
						this.SlowNums = 0
						this.time = 500
						this.FastNums = 5
					}
					if (this.FastNums > 5) {
						if (this.sel == sjNum) {
							this.noClick = true;
							this.LoopStatus = false
							// 成功的逻辑
							this.updateMoney(sjNum)
						}
					}
					if (this.LoopStatus) {
						setTimeout(() => {
							this.loop()
						}, this.time);
					}
				}
			}
		}
	
	}
	
</script>

<style scoped>
    /* 抽奖 */
	.luck-list{
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}
    .cell-item {
    	width: 150rpx;
    	height: 158rpx;
    	border-radius: 30rpx;
    	margin: 5rpx;
    }
    
    .cell-content {
    	width: 150rpx;
    	height: 138rpx;
    	border-radius: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
    }
    
    .w {
    	background-color: #fdf2ee;
    }
    
    .w-b {
    	background-color: #f8d0c3;
    }
    .y {
    	background-color: #fee610;
    }

    .y-b {
    	background-color: #EFCD22;
    }
</style>
