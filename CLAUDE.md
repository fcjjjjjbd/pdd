# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作提供指导。

## 项目概述

这是一个基于 **uni-app + Vue 3** 的多端应用项目，主要包含以下功能模块：

- **商品系统**：商品展示、分类浏览、搜索功能
- **师傅接单**：服务师傅接单管理系统
- **订单管理**：订单创建、支付、状态跟踪
- **用户系统**：基于 uni-id-pages 的用户认证和个人中心
- **推广中心**：用户推广管理和奖励系统
- **开源技术**：技术内容发布和管理（pages_fen 分包）

支持运行在 **H5、微信小程序、App** 等多个平台，使用 **uniCloud** 作为后端服务。

## 技术栈

- **前端框架**：uni-app + Vue 3 (Composition API)
- **构建工具**：Vite
- **状态管理**：Pinia + pinia-plugin-persistedstate (持久化存储)
- **云开发**：uniCloud (阿里云)
- **认证系统**：uni-id-pages
- **支付系统**：uni-pay
- **UI 组件**：uni-ui (uni-search-bar、uni-icons 等)
- **工具库**：dayjs、lodash.debounce、xe-utils、defu、destr

## 目录结构

```
├── pages/                    # 主包页面
│   ├── navlist/             # 首页 - 商品分类和展示
│   ├── detail/              # 商品详情页
│   ├── search/              # 搜索页
│   ├── my/                  # 个人中心相关页面
│   ├── order/               # 订单相关页面
│   ├── shifu/               # 师傅接单相关页面
│   └── self/                # 用户中心页
│
├── pages_fen/               # 分包 - 开源技术模块
│   ├── open/                # 开源技术内容管理
│   ├── advpay/              # 广告推广管理
│   └── feipin-admin/        # 拼团管理
│
├── pages_fena/              # 分包 - 用户商品模块
│   ├── love/                # 收藏商品
│   ├── product/             # 我的商品
│   ├── historyarr/          # 历史记录
│   └── appcenter/           # 推广中心
│
├── components/              # 组件库
│   ├── adv-card/            # 广告卡片
│   ├── article-item/        # 文章项
│   ├── card-goods/          # 商品卡片
│   ├── comment-item/        # 评论项
│   ├── goods-item/          # 商品项
│   ├── order-item/          # 订单项
│   └── mod-nav-bar/         # 自定义导航栏
│
├── stores/                  # Pinia 状态管理
│   ├── user.js              # 用户状态 (持久化)
│   ├── order.js             # 订单状态 (持久化)
│   ├── location.js          # 位置信息
│   └── dsmax.js             # 其他状态
│
├── utils/                   # 工具函数
│   ├── config.js            # 系统配置 (订单状态枚举等)
│   ├── tools.js             # 通用工具 (图片压缩、价格格式化等)
│   ├── common.js            # 公共方法 (路由跳转、弹窗等)
│   ├── system.js            # 系统信息
│   └── format.js            # 格式化函数
│
├── common/                  # 通用资源
│   ├── style/               # 公共样式
│   ├── images/              # 公共图片
│   └── js/                  # 公共 JS
│
├── manifest.json            # 应用配置文件 (平台适配、权限等)
├── pages.json               # 页面路由配置
├── vite.config.js           # Vite 构建配置
└── main.js                  # 应用入口 (Pinia 初始化)
```

## 常用开发命令

### 使用 HBuilderX 开发（推荐）
1. 打开 HBuilderX
2. 导入项目
3. 运行到浏览器：运行 → 运行到浏览器 → Chrome
4. 运行到微信小程序：运行 → 运行到小程序模拟器 → 微信开发者工具
5. 发行 H5：发行 → 发行为 H5

### 使用命令行开发
```bash
# 安装依赖
pnpm install

# 开发环境运行
# H5
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin

# App
npm run dev:app
```

### uniCloud 云开发
- 云函数位置：`uniCloud-aliyun/` 目录
- 云数据库集合：uni-id-users（用户表）、自定义商品表等
- 客户端通过 `uniCloud.importObject()` 调用云对象

## 核心架构

### 1. 页面路由 (pages.json)
- 主包页面在 `pages/` 目录
- 分包页面在 `pages_fen/` 和 `pages_fena/` 目录
- 底部 tabBar 包含：首页、开源技术、个人中心
- 需要登录的页面配置在 `uniIdRouter.needLogin` 中

### 2. 状态管理 (Pinia)
**stores/user.js** - 用户状态
- `userInfo`: 用户信息（持久化）
- `hasLogin`: 登录状态（持久化）
- `updateUserInfo()`: 更新用户信息
- `logout()`: 退出登录
- `loginSuccess()`: 登录成功回调

**stores/order.js** - 订单状态
- `orderGoodsList`: 订单商品列表（持久化）
- `orderGoodsTotal`: 商品总数量（计算属性）
- `orderPriceTotal`: 订单总金额（计算属性）
- `mapGoodsList`: 映射后的商品数据（计算属性）

### 3. 云对象调用
```javascript
// 商品云对象
const goodsCloudObj = uniCloud.importObject("client-product-goods");

// 用户云对象
const uniIdCo = uniCloud.importObject("uni-id-co");

// 调用云函数
const { errCode, data, errMsg } = await goodsCloudObj.list();
```

### 4. 公共工具函数
**utils/common.js**
- `routerTo(url, type)`: 路由跳转 (navigate/redirect/reLaunch)
- `showToast()`: 消息提示
- `showLoading()/hideLoading()`: 加载提示
- `showModal()`: 模态框确认
- `isAdminRole()`: 判断管理员权限
- `addressff()`: 地址拼接

**utils/tools.js**
- `convertImageToWebP()`: 图片压缩转 WebP
- `priceFormat()`: 价格格式化（分转元）
- `truncateString()`: 字符串截断
- `getProvince()`: 获取省份信息
- `calculateDistance()`: 计算距离
- `uuid()`: 生成订单号

**utils/config.js**
- `ORDER_STATUS_ENUMS`: 订单状态枚举定义
- `COLOR_THEME_PRIMARY`: 主色调
- 系统窗口信息和胶囊按钮信息

### 5. 页面开发示例
**首页 (pages/navlist/navlist.vue)**
- 左侧分类 + 右侧商品布局
- 搜索功能（待完善）
- 推广按钮跳转到推广中心
- 通过云对象获取分类数据

## 开发规范

### 1. 样式规范
- 使用 SCSS 预处理器
- 全局样式在 `uni.scss` 和 `common/style/common-style.scss`
- 主色调：`#bdaf8d`
- 选中颜色：`#CC0000`

### 2. 状态持久化
使用 `pinia-plugin-persistedstate` 实现状态持久化，配置在 store 的 `persist` 选项中

### 3. 自动导入
通过 Vite 的 `unplugin-auto-import/vite` 插件自动导入：
- Vue 组合式 API：`ref`, `reactive`, `onMounted` 等
- uni-app API：`uni` 相关方法

### 4. 平台适配
使用条件编译处理多端差异：
```javascript
// #ifdef H5
// H5 平台代码
// #endif

// #ifdef MP-WEIXIN
// 微信小程序平台代码
// #endif
```

## 关键配置

### manifest.json
- `appid`: `__UNI__66BB1BA`
- 支持平台：H5、微信小程序、支付宝、百度、字节跳动
- Android 权限：相机、网络、存储等
- 高德地图 SDK 配置

### pages.json
- 自定义导航栏：`navigationStyle: "custom"`
- 需要登录的页面在 `uniIdRouter.needLogin` 中配置
- 分包结构：`pages_fen` 和 `pages_fena`

## 注意事项

1. **云开发配置**：项目使用 uniCloud，需要在 DCloud 后台配置云空间
2. **用户认证**：基于 uni-id-pages，已集成登录、注册、找回密码等功能
3. **支付系统**：使用 uni-pay 插件，支付相关页面在分包中
4. **持久化存储**：Pinia 状态默认持久化到本地存储
5. **图片处理**：使用阿里云 OSS，`getSmallImg()` 函数可生成缩略图
6. **管理员权限**：通过 `isAdminRole()` 检查管理员角色

## 常用页面路径

- 首页：`/pages/navlist/navlist`
- 商品详情：`/pages/detail/detail`
- 搜索页：`/pages/search/search`
- 用户中心：`/pages/self/self`
- 订单列表：`/pages/order/list`
- 师傅接单：`/pages/shifu/list`
- 推广中心：`/pages_fena/appcenter/appcenter`
- 开源技术：`/pages_fen/open/open-news`
- 登录页：`/pages/login/login`

## 调试技巧

1. **云函数调试**：在 HBuilderX 中右键云函数 → 调试
2. **小程序调试**：运行到微信开发者工具，使用真机预览
3. **H5 调试**：浏览器开发者工具
4. **状态查看**：用户状态存储在 `uni-id-pages-userInfo`，订单状态在 `order-store`
