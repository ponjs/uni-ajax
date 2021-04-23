# V2 迁移指南

本指南主要是项目中有使用`1.x`版本的用户升级到`2.x`的一个大概变迁介绍。

## 创建实例

- **1.x**

```Javascript
import createAjax from 'uni-ajax'

const instance = createAjax(config)
```

- **2.x**

```Javascript
import ajax from 'uni-ajax'

const instance = ajax.create(config)
```

## 实例配置

- **1.x**

```Javascript
{
  baseUrl: '',    // 请求根地址（2.x 改为 baseURL 注意大小写）
  response: {}    // 传值给拦截器（2.x 已弃用该方式传值）
}
```

- **2.x**

```Javascript
{
  baseURL: ''
}
```

## 传值给拦截器

V1 中我们通过`response`属性传值给拦截器，拦截器也通过`response`属性获取。而在 V2 中我们可以直接在请求配置上传值，然后拦截器通过`config`属性获取当前请求配置，进而获取该传送的值。如果你在 V1 过渡到 V2 可以通过`config.response`这么获取。

- **1.x**

```Javascript
ajax({
  response: { value: 'ajax' }
})
```

- **2.x**

```Javascript
ajax({
  value: 'ajax'
})
```

## RequestTask

在 V1 中如果要获取`RequestTask`对象需传参为`config`一个对象，然后接收`Promise.resolve`的返回值。而在 V2 中，该参数至少传入`success / fail / complete`参数中的一个，这点是为了契合`uni.request`获取`RequestTask`方式一致。但是在`2.1.0`版本中加入了[直接调用](/usage/request-task.html)的方法，使其使用`RequestTask`上的方法更加方便。

- **1.x**

```JavaScript
const requestTask = await ajax({
  url: 'https://www.example.com'
})
```

- **2.x**

```JavaScript
const requestTask = await ajax({
  url: 'https://www.example.com',
  complete: () => {}
})
```

## 请求拦截器拒绝发送请求

V1 请求拦截器中只需返回`false`，并会触发请求错误事件。虽然在 V2 中也可以这么做，但是不推荐。我们可以请求拦截器返回`Promise.reject`，这样不仅可以自定义错误信息，并且不会触发当前请求错误事件，而是在请求方法中抛出请求失败。

- **1.x**

```JavaScript
instance.interceptors.request.use(
  config => {
    return false
  },
  error => {
    console.log(error)
    return error
  }
)
```

- **2.x**

```JavaScript
instance.interceptors.request.use(
  config => {
    return Promise.reject({
      config,
      errMsg: 'request:fail intercepted'
    })
  }
)
```

## 错误拦截器触发事件

在 V1 中在错误拦截器（请求和响应）里无论返回什么都是触发`fail / catch`。但在 V2 版本必须返回 `Promise.reject` 才会触发`fail / catch`，否则都是触发 `success / then`。

- **1.x**

```JavaScript
instance.interceptors.request.use(
  config => {
    return false
  },
  error => {
    return error
  }
)
```

- **2.x**

```JavaScript
instance.interceptors.request.use(
  config => {
    return false
  },
  error => {
    return Promise.reject(error)
  }
)
```
