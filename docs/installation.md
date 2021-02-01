# 安装

## 插件市场

在[插件市场](https://ext.dcloud.net.cn/plugin?id=2351)右上角选择`使用HBuilder X 导入插件`或者`下载插件ZIP`。

- 如果您的项目是由`HBuilder X`创建，将下载解压后的`uni-ajax`文件夹，放到项目根目录。

```{4}
.
├── pages
├── static
├── uni-ajax
├── App.vue
├── main.js
├── manifest.json
├── pages.json
└── uni.scss
```

- 如果您的项目是由`vue-cli`模式创建的，将下载解压后的`uni-ajax`文件夹放到项目的`src`文件夹中。

```{8}
.
├── .git
├── node_modules
├── public
├── src
│   ├── pages
│   ├── static
│   ├── uni-ajax
│   ├── App.vue
│   ├── main.js
│   ├── manifest.json
│   ├── pages.json
│   ├── uni.scss
├── .gitignore
├── babel.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tsconfig.json
└── yarn.lock
```

::: tip
当然，上面两种方式的放置路径可根据项目实际情况，只是这样放置方便下面这样引入而已

```Javascript
import ajax from 'uni-ajax'
```

:::

## NPM

在项目开发中更推荐使用 NPM 安装。

```bash
# 安装
npm install uni-ajax

# 更新
npm update uni-ajax
```

如果您的项目是`HBuilder X`创建的，根目录又没有`package.json`文件的话，请先执行如下命令再安装：

```bash
npm init -y
```
