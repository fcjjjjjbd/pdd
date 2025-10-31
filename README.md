订单弹窗明码标价,首页2级分类后台
专一,老师随风虾米 trae,GLM-4.
习惯,站立,$户外写程序,不带耳机,提交 git
0,善假于 ai,(一个个字母写)---
<view class="item" :style="{ color: item.color }" v-for="item in menuList" :key="item.label" @click="routerTo(item.url)">
					<view class="icon" :style="{ background: `linear-gradient(to bottom,${item.bg1},${item.bg2})` }">
						<text class="iconfont" :class="item.icon"></text>
					</view>
					<view class="label">{{ item.label }}</view>
				</view>