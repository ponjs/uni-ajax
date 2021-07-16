# 安装

## 插件市场

在[插件市场](https://ext.dcloud.net.cn/plugin?id=2351)右上角选择`使用HBuilder X 导入插件`或者`下载插件ZIP`。

```Javascript
// 引入
import ajax from '@/uni_modules/u-ajax/js_sdk'
```

## NPM

在项目开发中更推荐使用 NPM 安装。

```bash
# 安装
npm install uni-ajax

# 更新
npm update uni-ajax
```

```Javascript
// 引入
import ajax from 'uni-ajax'
```

如果您的项目是`HBuilder X`创建的，根目录又没有`package.json`文件的话，请先执行如下命令再安装：

```bash
npm init -y
```

项目根目录下创建`vue.config.js`文件。 <Badge text="3.0.0"/>

```JavaScript
// vue.config.js
module.exports = {
  transpileDependencies: ['uni-ajax']
}
```
