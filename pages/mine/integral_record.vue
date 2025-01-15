<template>
	<view>
		<view v-if="dataList.length != 0" class="re-box">
			<view>
				<text style="font-size: 40rpx;color: #0081ff;" class="cuIcon-titles"></text><text style="font-size: 35rpx;">积分明细</text>
			</view>
			<view style="margin-top: 40rpx;">
				<view v-for="(item,index) in dataList" :key="index" class="flex solid-bottom padding justify-between">
					<view class="">
						<view class="re-type">{{item.source}}</view>
						<view class="re-time">{{item.integralTime}}</view>
					</view>
					<view v-if="item.isAdd == 0" class="re-number">+{{item.integralNumber}}
					<text class="cuIcon-vip" style="margin-left: 15rpx;font-size: 40rpx;"></text>
					</view>
					<view v-else style="color: #07C160;" class="re-number">-{{item.integralNumber}}
					<text class="cuIcon-vip" style="margin-left: 15rpx;font-size: 40rpx;"></text>
					</view>
					
				</view>
				
			</view>
		</view>
		<view style="text-align: center;" v-else>
			<image style="width: 400rpx;height: 200rpx;margin-top: 200rpx;" src="/static/public/nodata.svg"></image>
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
		listAppIntegra
	} from "@/api/app/index.js"
	export default {
		data() {
			return {
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					userId: uni.getStorageSync("userInfo").userId,
					
				},
				dataList: [],
				total: 0,
				showTotal: false,
			}
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
				listAppIntegra(this.queryParams).then(response => {
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
		onLoad() {
			this.getDataList()
		},
		methods: {
			getDataList(){
				var that = this;
				listAppIntegra(this.queryParams).then(response => {
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
			}
		}
	}
</script>

<style>
	.re-type{
		font-size: 33rpx;
	}
	.re-time{
		font-size: 30rpx;
		color: #adadad;
		margin-top: 15rpx;
	}
	.re-number{
		font-size: 40rpx;
		color: red;
		margin-top: 20rpx;
	}
	.re-box{
		min-height: 500rpx;
		background-color: white;
		border-radius: 20rpx;
		margin: 0 40rpx 40rpx 40rpx;
		padding: 20rpx;
	}
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
		margin-bottom: 100rpx;
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
