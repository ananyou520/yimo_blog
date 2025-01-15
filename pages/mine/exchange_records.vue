<template>
	<view>
		<view v-if="dataList.length != 0" class="re-box">
			<view>
				<text style="font-size: 40rpx;color: #0081ff;" class="cuIcon-titles"></text><text style="font-size: 35rpx;">兑换明细</text>
			</view>
			<view style="margin-top: 40rpx;">
				<view v-for="(item,index) in dataList" :key="index" class="flex solid-bottom padding justify-between">
					<view class="">
						<view class="re-type">{{item.goodsName}}</view>
						<view class="re-time">兑换码：{{item.redemptionCode}}</view>
						<view class="re-time">兑换时间：{{item.recordsTime}}</view>
					</view>
					<view class="re-number">-{{item.recordsNumber}}
					<text class="cuIcon-vip" style="margin-left: 15rpx;font-size: 40rpx;"></text>
					</view>
					
				</view>
				
			</view>
		</view>
		<view v-else style="text-align: center;" >
			<image style="width: 400rpx;height: 200rpx;margin-top: 200rpx;" src="/static/public/nodata.svg"></image>
			<view style="color: #adadad;">无数据</view>
		</view>
		
	</view>
</template>

<script>
	import {
		listExchange
	} from "@/api/app/index.js"
	export default {
		data() {
			return {
				queryParams: {
					recordsUserId: uni.getStorageSync("userInfo").userId,
				},
				dataList: [],
			}
		},
		
		onLoad() {
			this.getDataList()
		},
		methods: {
			getDataList(){
				var that = this;
				listExchange(this.queryParams).then(response => {
					that.dataList = response.rows
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
		font-size: 35rpx;
		color: red;
		margin-top: 55rpx;
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
