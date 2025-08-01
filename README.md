# 专一APP挣钱

## 项目介绍

这是一个基于uni-app开发的跨平台应用，支持微信小程序、H5、Android和iOS等多个平台。应用主要功能是提供一个商品展示和订单管理的平台。

## 技术栈

- 前端框架：Vue 3
- 跨平台框架：uni-app
- 状态管理：Pinia
- UI组件库：uview-plus
- 云服务：uniCloud

## 目录结构

- `components/`: 组件目录
  - `goods-item/`: 商品项组件
  - 其他组件...
- `pages/`: 页面目录
  - `navlist/`: 导航列表页面
  - 其他页面...
- `static/`: 静态资源目录
  - `images/`: 图片资源
- `stores/`: Pinia状态管理
  - `navlistStore.js`: 导航列表状态管理
  - 其他状态管理...
- `utils/`: 工具函数
  - `db.js`: 数据库操作工具
  - `addcloub.js`: 云存储操作工具

## 主要功能

1. 商品展示和分类
2. 订单管理
3. 用户登录和认证
4. 图片上传和管理

## 安装和运行

```bash
# 安装依赖
npm install

# 运行到H5平台
npm run dev:h5

# 运行到微信小程序
npm run dev:mp-weixin
```

## 配置说明

应用配置在`manifest.json`文件中，包括：

- 微信小程序appid: wx8e6e164b2cf51f88
- 高德地图SDK配置
- Android和iOS权限配置

## 注意事项

1. 需要配置uniCloud云服务
2. 微信小程序需要正确配置appid
3. 使用高德地图功能需要配置相应的key