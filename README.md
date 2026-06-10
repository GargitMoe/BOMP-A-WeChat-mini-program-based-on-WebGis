# BOMP!

**校园地图社交小程序** — 基于位置的信息发布与社区互动平台。

> 📱 微信小程序 · uni-app (Vue 2) · uniCloud 云开发 · 腾讯地图

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## 项目简介

**BOMP!**（"Bump!" 的变体，取"碰撞"之意）是一个面向校园场景的**地图社交小程序**。用户在地图上发布带有位置标记的帖子，其他用户可以在地图上浏览周围的消息气泡，进行评论、收藏、私聊等互动。

### 核心功能

| 模块 | 功能 |
|------|------|
| 🗺️ **地图首页** | 原生地图 (`list.nvue`)，帖子以气泡标记展示，支持区域刷新、当前位置定位 |
| 📝 **帖子系统** | 发布/编辑/删除帖子，支持标题、正文、图片、位置选择 |
| 🏷️ **分类浏览** | 普通帖子 · 失物招领 · 演出信息 · 摄影 · 运动 · 志愿者 · 校园猫 |
| 💬 **社区互动** | 评论/回复、点赞、收藏、浏览计数 |
| 🔔 **私聊** | 用户间实时聊天 (Chat/Chat-2/Chat-3) |
| 👤 **用户系统** | uni-id 登录、个人主页、设置中心 |

### 帖子分类

发布时选择标签 (`tag`)，不同类型展示不同的附加字段：

```
0 — 普通贴         标题 + 内容 + 图片 + 位置 + 联系方式
3 — 失物招领       标题 + 丢失/捡到物品 + 图片 + 位置 + 联系方式  
4 — 演出信息       标题 + 演出地点 + 内容 + 图片 + 位置
5 — 校园猫         标题 + 内容 + 图片 + 位置
6 — 摄影投稿       标题 + 内容 + 图片 + 位置
7 — 运动约伴       标题 + 内容 + 图片 + 位置
8 — 志愿者招募     标题 + 内容 + 图片 + 位置
```

---

## 技术架构

```
┌─────────────────────────────────────┐
│   uni-app (Vue 2) — 微信小程序端    │
│   ┌───────────┐  ┌──────────────┐   │
│   │  uView UI  │  │   uni-ui     │   │
│   └───────────┘  └──────────────┘   │
│   ┌──────────────────────────────┐  │
│   │   腾讯地图 SDK (qqmap)       │  │
│   │   list.nvue — 原生地图渲染   │  │
│   └──────────────────────────────┘  │
├─────────────────────────────────────┤
│   uniCloud (阿里云)                 │
│   ├── 云数据库 (Schema)             │
│   │   ├── tiezi.schema.json         │
│   │   ├── Article.schema.json       │
│   │   ├── article_comment.schema    │
│   │   ├── Article_Collection.schema │
│   │   └── ...                       │
│   ├── 云函数                        │
│   └── uni-id 用户认证               │
└─────────────────────────────────────┘
```

### 关键技术点

- **地图页使用 `.nvue` 文件**（Weex 原生渲染），解决小程序地图层级和性能问题
- 地图区域变化时触发 `@regionchange` 事件，动态加载范围内的帖子气泡
- `uniCloud-db` 组件前端直接操作云数据库
- uni-id-pages 插件管理登录/注册/用户资料

---

## 项目结构

```
BOMP/
├── pages/
│   ├── list/list.nvue           # ★ 地图首页（原生地图 + 帖子气泡）
│   ├── grid/grid.vue            #   社群/分类浏览
│   ├── tiezi/                   #   帖子模块
│   │   ├── add.vue / edit.vue   #     发布/编辑
│   │   ├── detail.vue           #     详情页
│   │   ├── list.vue             #     列表浏览
│   │   ├── mylist.vue           #     我的帖子
│   │   ├── searchT/             #     搜索
│   │   ├── mycollection/        #     收藏夹
│   │   ├── *List/               #     各分类列表页 (6个)
│   ├── Chat.vue / Chat-2/3/     #   私聊模块
│   ├── CommentMe/ / reply/      #   评论/回复
│   ├── UserDetail/ / MyInfo/    #   用户主页
│   └── ucenter/                 #   个人中心 + 设置
├── components/                  #   自定义组件
│   ├── comment-frame/           #     评论框
│   ├── comment-item/            #     评论项
│   ├── refreshBox/              #     下拉刷新 (nvue)
│   └── ezpage.vue               #     空白页状态
├── common/                      #   公共模块 (appInit, cloudApi, openApp)
├── utils/tools.js               #   距离计算等工具函数
├── uniCloud-aliyun/             #   云服务
│   └── database/                #     数据库 Schema (50+ 表)
├── uni_modules/                 #   uni-ui 组件 (60+ 个)
├── static/                      #   静态资源 (图标、tabbar)
├── App.vue / main.js            #   应用入口
├── pages.json                   #   页面路由 & TabBar 配置
├── manifest.json                #   应用配置 (含微信 appid)
└── package.json
```

---

## 运行说明

### 环境

- **HBuilderX** 3.2.6+
- 微信开发者工具
- uniCloud 阿里云空间（需绑定）

### 本地运行

1. 用 HBuilderX 打开项目目录
2. 关联 uniCloud 服务空间
3. 上传云数据库 Schema（`uniCloud-aliyun/database/`）
4. 运行 → 微信小程序（会自动编译并打开微信开发者工具）

### 注意

- 地图功能需要在 `manifest.json` 中配置有效的腾讯地图 key
- 微信 appid 需要替换为自己的
- uni-id 配置在 `uni_modules/uni-id-pages/` 中

---

## 已知局限 & 回顾

> 这个项目创作于本科低年级，是一个学习过程中的实验性作品。以下是当时的一些不成熟之处：

- **代码组织**：`Chat.vue`/`Chat-2.vue`/`Chat-3.vue` 三个私聊页面通过复制粘贴实现，未抽象为组件
- **数据库设计**：Schema 文件数 50+，部分表已废弃未清理
- **状态管理**：无 Vuex/Pinia，数据流分散在各页面
- **错误处理**：缺少统一异常处理，部分 API 调用无 try-catch
- **权限控制**：前端权限校验为主，安全性较弱
- **性能优化**：地图 marker 无分页/聚合，数据量大时可能卡顿

*这些槽点是成长过程的一部分，也是未来重构的方向。*

---

## License

本项目代码基于 [Apache-2.0](LICENSE) 协议开源。

uni-starter 模版、uView UI、uni-ui 等第三方库版权归各自作者所有。

---

## 更新日志

项目自定义修改 → 见 `changelog.md`（顶部为项目真实变更，底部为 uni-starter 模板原始 changelog）
