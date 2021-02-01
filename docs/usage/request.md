# 请求方法

## 参数

[请求方法][1]传参有`[url[, data[, config]]]`或`[config]`。直接返回都是封装后的[Promise 对象][2]，并支持[RequestTask 方法][3]。

::: tip PROMISE

- [[url[, data[, config]]]][4]
  - resolve: &nbsp;响应成功对象
  - reject: &nbsp;&nbsp;&nbsp;请求或响应失败对象

* [[config]][5]
  - resolve: &nbsp;响应成功对象 / RequestTask 对象
  - reject: &nbsp;&nbsp;&nbsp;请求或响应失败对象 / 无

:::

### `[url[, data[, config]]]`

`url` \<String\> 请求地址  
`data` \<Object / String / ArrayBuffer\> 请求参数  
`config` \<Object\> 其他选项

| 参数            | 类型     | 说明                                                                            |
| :-------------- | :------- | :------------------------------------------------------------------------------ |
| header          | Object   | 设置请求的 header，header 中不能设置 Referer                                    |
| method          | String   | 请求协议（如果是请求方式使用，method 设置是无效的，只有在 ajax() 使用时才生效） |
| timeout         | Number   | 超时时间，单位 ms                                                               |
| dataType        | String   | 如果设为 json，会尝试对返回的数据做一次 JSON.parse                              |
| responseType    | String   | 设置响应的数据类型。合法值：text、arraybuffer                                   |
| sslVerify       | Boolean  | 验证 ssl 证书                                                                   |
| withCredentials | Boolean  | 跨域请求时是否携带凭证（cookies）                                               |
| firstIpv4       | Boolean  | DNS 解析时优先使用 ipv4                                                         |
| validateStatus  | Function | 定义对于给定的 HTTP 状态码返回拦截状态                                          |
| ...             | Any      | 传递给拦截器的值                                                                |

### `[config]`

`config` \<Object\> 请求选项

在上面参数的其他选项基础上多了以下选项。

| 参数     | 类型                          | 说明                                             |
| :------- | :---------------------------- | :----------------------------------------------- |
| url      | String                        | 请求地址，不填时默认配置的 baseURL               |
| data     | Object / String / ArrayBuffer | 请求参数                                         |
| success  | Function                      | 收到开发者服务器成功返回的回调函数               |
| fail     | Function                      | 接口调用失败的回调函数                           |
| complete | Function                      | 接口调用结束的回调函数（调用成功、失败都会执行） |

## 响应

请求的响应包含以下信息。

| 参数       | 类型                          | 说明                                   |
| :--------- | :---------------------------- | :------------------------------------- |
| data       | Object / String / ArrayBuffer | 服务器返回的数据                       |
| statusCode | Number                        | 服务器响应的 HTTP 状态码               |
| header     | Object                        | 服务器响应的头                         |
| config     | Object                        | 请求提供的配置信息                     |
| cookies    | Array\<string\>               | 服务器返回的 cookies，格式为字符串数组 |

[1]: /usage/api.html#请求方法
[2]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
[3]: /usage/request-task
[4]: /usage/request.html#url-data-config
[5]: /usage/request.html#config
