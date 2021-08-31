# 介绍

**`uni-ajax`** 是参考 [Axios][1] 的使用方式封装 [uni.request][2] 方法，但更轻量，且保留 uni.request 的核心。在 uni-app 项目开发中切合实际，开箱即用，配置简单。如果您有 Axios 的使用经验，相信很快上手。如果没有，别担心，通过这份文档，带您简单上手并深入使用。

为什么参考了 Axios ？ 因为 uni.request 在实际项目开发中存在一些不方便，自己在实际的项目开发中习惯用 Axios 作为请求库。刚开始开发 uni-app 项目时找不到顺手的库，后来索性就自己写了并开源。

## 特性

- 支持 Promise API
- 支持 Typescript 开发
- 拦截请求和响应
- 自定义配置请求实例
- 多种 Method 方法请求
- 支持 RequestTask 操作

## 链接

::: tip 提示
如有什么问题可在 [插件市场](https://ext.dcloud.net.cn/plugin?id=2351) 上评论留言，源码注释清晰，可以的话在 [GitHub](https://github.com/ponjs/uni-ajax) 点个 star 吧！
:::

- [DCloud][3]<br />
- [GitHub][4]<br />
- [NPM][5]

## 文档版本

本文档是 `2.x` 版本，如果您当前使用的是 `1.x` 版本，请更新至最新版本！可查看 [V2 迁移指南][6]。

## 模板工程

这里我搭建了一个 uni-app 的模板工程，主要有下面这些依赖。已配置好企业项目中常用功能，例如 API 集中管理、路由守卫、eslint 代码规范等等。

👉&nbsp;&nbsp;[uni-app-boilerplate](https://github.com/ponjs/uni-app-boilerplate)

- [uni-app](https://uniapp.dcloud.io/)
- [typescript](https://www.typescriptlang.org/)
- [eslint](https://eslint.bootcss.com/)
- [prettier](https://prettier.io/docs/en/options.html)
- [tailwindcss](http://tailwind.wyz.xyz/)
- [uni-ajax](https://uniajax.ponjs.com/)
- [uview-ui](https://uviewui.com/)
- [uni-simple-router](https://hhyang.cn/v2/)
- [vuex-module-decorators](https://github.com/championswimmer/vuex-module-decorators)

[1]: https://github.com/axios/axios
[2]: https://uniapp.dcloud.io/api/request/request
[3]: https://ext.dcloud.net.cn/plugin?id=2351
[4]: https://github.com/ponjs/uni-ajax
[5]: https://www.npmjs.com/package/uni-ajax
[6]: /migration.html
