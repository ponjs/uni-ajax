# Next 版本 <Badge>2.5.0-next</Badge>

该版本精简了很多代码，体积更小，性能提升 `28%` ！因此在使用上有所调整，主要是中断请求方法。

```bash
npm install uni-ajax@next
```

<div>
  <div style="font-size:12px;color:var(--vp-c-text-2);margin-left:10px">BUNDLE SIZE</div>
  <img src="./next.png" />
</div>

## 移除回调

在常规版本中，我们可以传入 `success / fail / complete` 回调参数。但统计后大家对这方式使用极少，所以砍掉该功能。采用 `Promise` 的方式接收响应值。

## 调整中断请求方法

在常规版本中，我们实现中断请求方式如下，该方式实现是通过继承 `Promise` 来扩展。<Badge type="danger">废弃</Badge>

```js
const request = ajax()
request.abort() 
```

又或者通过获取 `RequestTask` 对象来中断。<Badge type="danger">废弃</Badge>

```js
ajax({
  xhr: (requestTask, config) => {
    requestTask.abort()
  }
})
```

在 Next 版本中，上面两种方式都废弃了，现在整合为一个 `fetcher` 属性，该属性传递抓取器实例，请求方法内部会抓取 `uni.request` 的返回值。

```js
import ajax, { Fetcher } from 'uni-ajax'

const fetcher = new Fetcher()

ajax({ fetcher })

fetcher.abort() // 中断请求（Fetcher 只封装了 abort 方法，其他请使用 source 获取使用）
fetcher.source().then(requestTask => {}) // 获取请求任务对象
```

## 修改处理请求方法

之前我们的 `adapter` 方式是有两个参数的，第二个参数为继承 `Promise` 的请求构造函数。但现在该构造函数已经废弃了，所以没有第二个参数，只有一个 `config` 请求配置参数。
