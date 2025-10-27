<script setup>
import dayjs from "dayjs"
import { ref } from "vue";
import {onLoad} from "@dcloudio/uni-app"
import { showToast } from "../../utils/common";
const pddCloudObj = uniCloud.importObject("client-aopen", {
  customUI: true,
});
let id;
onLoad((e)=>{
	id = e.id;
	getDetail();
})

const detail = ref()

// {errCode,data}
const getDetail = async()=>{
	try{
		let {data }= await pddCloudObj.detailxg(id);
		console.log(data)
		detail.value = data;
		uni.setNavigationBarTitle({
			title:detail.value.name
		})
	}catch(err){
		console.log(err);
		showToast(err)
	}
	
}



</script>

<template>
	<view class="page-wrap" v-if="detail?.name" >
		<view class="news-title">
			</view>
		<view class="news-info">
			<view class="author"></view>
			<view class="date"></view>
		</view>
		<view class="news-content">
			<uv-parse :content="detail.content"></uv-parse>			
		</view>
		<view style="padding:30rpx 0; font-size: 28rpx;color:#666">阅读量： {{detail.view_count}}</view>
	
	</view>
		<uni-load-more status="loading"  v-else></uni-load-more>

	
</template>

<style lang="scss" scoped>
	.page-wrap{
		padding:24rpx 32rpx;
		.news-title{
			font-size: 36rpx;
			font-weight: bolder;
			line-height: 1.6em;
			padding-bottom: 24rpx;
		}
		.news-info{
			display: flex;
			gap:16rpx;
			font-size: 28rpx;
			color:#888;
			padding-bottom:24rpx;
		}
		.news-content{
			:deep(._root){
				overflow-x: hidden;
			}
		}
	}
</style>
