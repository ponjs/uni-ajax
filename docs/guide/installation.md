# 安装

## 插件市场

在 [插件市场](https://ext.dcloud.net.cn/plugin?id=2351) 右上角选择 `使用 HBuilderX 导入插件` 或者 `下载插件 ZIP` 。

```js
// 引入
import ajax from '@/uni_modules/u-ajax'

// 2.4.5 以下版本
// import ajax from '@/uni_modules/u-ajax/js_sdk'
```

## npm

在项目开发中更推荐使用 npm 安装。

```bash
# 安装
npm install uni-ajax

# 更新
npm update uni-ajax
```

```js
// 引入
import ajax from 'uni-ajax'
```

如果你的项目是 HBuilderX 创建，根目录又没有 package.json 文件的话，请先执行如下命令再安装：

```bash
npm init -y
```

项目根目录下创建 vue.config.js 文件。因为 uni-ajax 使用了 ES11 的新特性，所以需要通过项目 Babel 显式转译。<Badge text="2.4.1" />

```js
// vue.config.js
// 如果是 vue3 + vite, 无需添加配置

module.exports = {
  transpileDependencies: ['uni-ajax']
}
```
