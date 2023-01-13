# 请求实例

## 创建实例

`ajax.create(config)`

在实际项目开发中，我们的接口地址是通常是同个根地址，我们需要配置接口根地址方便代码的维护。而且我们对于请求和响应的都会做同样的判断，这里就可以用到拦截器，避免冗余的代码。

首先我们先新建 ajax.js 文件（文件名可自定义），用于配置项及拦截器。

```js
// 引入 uni-ajax 模块
import ajax from 'uni-ajax'

// 创建实例
const instance = ajax.create({
  // 实例初始配置（对象配置）
})

// 导出创建后的实例
export default instance
```

### 对象配置

我们在创建实例时可以传递一个对象，该对象为请求实例的初始默认配置。该配置与我们在[请求方法](/guide/usage#请求配置)时传递的请求配置是一致的。你可以通过该[文档](/api/config)查看详情内容。

```js
// 创建实例
const instance = ajax.create({
  /* 实例初始配置 */
})
```

### 函数配置

当创建实例传入的是一个函数时，并且该函数需返回上面的配置对象。每次请求前都会执行该函数（在请求拦截器之前），然后将执行后返回值传递给请求拦截器。这里的函数参数支持 async / await 操作。

```js
// 创建实例
const instance = ajax.create(() => {
  return {
    /* 实例初始配置 */
  }
})
```

## 默认配置

在 uni-ajax 中可以获取公用的请求配置。可分为全局配置和实例配置。

### 全局配置

`ajax.defaults` <Badge text="2.4.1" />

我们上面的创建的请求实例，在应用中可以创建多个，但是它们都是共享着这个全局默认配置。在这个配置中的修改会应用到每个请求实例，但如果你的实例中配置了同样的属性，uni-ajax 取的是实例中属性。

```js
// 可对 defaults 上的属性进行修改
ajax.defaults.baseURL = 'https://www.example.com/api'
// ❌ 但不能直接赋值
ajax.defaults = { baseURL: 'https://www.example.com/api' }
```

### 实例配置

`instance.config` <Badge text="2.4.1" />

该属性是获取我们创建实例时所传递的实例配置。如果你在创建实例时传递的对象那么它就是对象类型，反之如果是传递的是函数则它函数类型，与你所创建时的配置相对应。要注意的是它是只读的，你不可对其修改。

```js
// 假设你创建请求实例时是对象类型
const instance = ajax.create({
  baseURL: 'https://www.example.com/api'
})
instance.config.baseURL // 直接获取对象实例配置 baseURL

// 假设你创建请求实例时是函数类型
const instance = ajax.create(() => ({
  baseURL: 'https://www.example.com/api'
}))
instance.config().baseURL // 调用函数实例配置获取 baseURL

// 假设你创建请求实例时是异步函数类型
const instance = ajax.create(async () => ({
  baseURL: 'https://www.example.com/api'
}))
;(await instance.config()).baseURL // 调用异步函数实例配置获取 baseURL
```
