<template>
	<view class="container">
		<view class="header">
			<text class="title">二手交易平台</text>
		</view>
		
		<view class="content">
			<view class="search-bar">
				<input type="text" v-model="searchText" placeholder="搜索二手商品" />
				<button @click="searchItems">搜索</button>
			</view>
			
			<view class="category-list">
				<view class="category-item" v-for="(category, index) in categories" :key="index" @click="selectCategory(category)">
					<text>{{category.name}}</text>
				</view>
			</view>
			
			<view class="product-list">
				<card-goods v-for="(item, index) in productList" :key="index" :item="item" @click="viewDetail"></card-goods>
			</view>
		</view>
		
		<view class="publish-btn" @click="publishItem">
			<uni-icons type="plus" size="30" color="#FFFFFF"></uni-icons>
		</view>
	</view>
</template>

<script>
import CardGoods from '@/components/card-goods/card-goods.vue';

	export default {
		components: {
			CardGoods
		},
		data() {
			return {
				searchText: '',
				categories: [
					{ id: 1, name: '手机数码' },
					{ id: 2, name: '电脑办公' },
					{ id: 3, name: '家用电器' },
					{ id: 4, name: '服装鞋包' },
					{ id: 5, name: '生活用品' },
					{ id: 6, name: '运动户外' },
					{ id: 7, name: '图书音像' },
					{ id: 8, name: '其他' }
				],
				productList: [
					{
						id: 1,
						title: 'iPhone 13 Pro Max 256G 深空灰色',
						price: 6999,
						image: '/static/images/demo/phone.jpg',
						location: '北京市海淀区',
						description: '99新，去年买的，一直有贴膜和壳，无划痕，电池健康度95%'
					},
					{
						id: 2,
						title: 'MacBook Pro 2021 M1 Pro 16寸',
						price: 12000,
						image: '/static/images/demo/laptop.jpg',
						location: '上海市浦东新区',
						description: '9成新，轻度办公使用，无磕碰，原装充电器'
					},
					{
						id: 3,
						title: '索尼 WH-1000XM4 无线降噪耳机',
						price: 1500,
						image: '/static/images/demo/headphone.jpg',
						location: '广州市天河区',
						description: '95新，音质完美，降噪效果好，配件齐全'
					},
					{
						id: 4,
						title: '耐克 Air Jordan 1 篮球鞋',
						price: 800,
						image: '/static/images/demo/shoes.jpg',
						location: '深圳市南山区',
						description: '42码，穿过几次，无明显磨损，附赠鞋盒'
					}
				]
			}
		},
		methods: {
			searchItems() {
				// 实现搜索功能
				console.log('搜索:', this.searchText);
				// 这里应该调用API进行搜索
			},
			selectCategory(category) {
				// 选择分类
				console.log('选择分类:', category.name);
				// 这里应该根据分类筛选商品
			},
			viewDetail(item) {
				// 查看商品详情
				console.log('查看商品:', item.title);
				// 跳转到详情页
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + item.id
				});
			},
			publishItem() {
				// 发布商品
				console.log('发布商品');
				// 跳转到发布页面
				uni.navigateTo({
					url: '/pages_fena/product/edit'
				});
			}
		}
	}
</script>

<style>
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.header {
	background-color: #CC0000;
	padding: 20rpx;
	text-align: center;
}

.title {
	color: #FFFFFF;
	font-size: 36rpx;
	font-weight: bold;
}

.content {
	flex: 1;
	padding: 20rpx;
	background-color: #F5F5F5;
}

.search-bar {
	display: flex;
	margin-bottom: 20rpx;
}

.search-bar input {
	flex: 1;
	background-color: #FFFFFF;
	padding: 10rpx 20rpx;
	border-radius: 10rpx;
	margin-right: 10rpx;
}

.search-bar button {
	background-color: #CC0000;
	color: #FFFFFF;
	font-size: 28rpx;
	padding: 0 30rpx;
	height: 70rpx;
	line-height: 70rpx;
}

.category-list {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 20rpx;
}

.category-item {
	background-color: #FFFFFF;
	padding: 10rpx 20rpx;
	margin: 10rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
}

.product-list {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
}

.publish-btn {
	position: fixed;
	bottom: 150rpx;
	right: 50rpx;
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background-color: #CC0000;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 0 20rpx rgba(204, 0, 0, 0.5);
	z-index: 999;
}
</style>