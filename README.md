# mock
一套前端mock的解决方案，详情见 [mock方案总结](https://github.com/hudk114/front-end/blob/master/config/mock.md)，与 [mock服务器](https://github.com/hudk114/front-end/blob/master/config/mock-server) 搭配使用风味更佳哦

# 出发点
在前端代码中可以方便的控制mock
对于一个请求`/user`，mock请求地址可能为`/mock/user`，真实请求为`http://example.org/user`，在不需要修改后端数据库和重启项目的情况下，需要采用一套方案能够在前端代码中方便的调整部分请求的uri前缀

# usage
1. webpack等打包工具

    npm install -S @hudk/mock
需要设置process.env.NODE_ENV

2. 直接引入[js文件](https://github.com/hudk114/mock/blob/master/dist/proxyMock.js)，支持AMD，CMD或直接使用
此种方式无法防止uri在线上不访问mock的问题，需要手动关闭

# Example
[exmaple](https://github.com/hudk114/mock/tree/master/example)，clone后 `npm install && npm run example`

# api
proxyMock为一个单例，内部维护一份options，作为全局请求的转发中间层。一个拼装后的uri由两部分组成：`{append}{uri}`。

1. setOptions

    设置options

    * 参数： options: { MOCK: Boolean, MOCK_APPEND: String, DOMAIN: string, request: Function }
    * 返回值： 无
    * 使用： 设置proxyMock默认情况下的发送，MOCK指请求是否默认采用mock，MOCK_APPEND指定默认的mock前缀，DOMAIN指定默认的非mock请求前缀，request指定拼装完的回调处理方法，默认通过axios发起请求

options默认值
```js
const OPTIONS = {
  // 默认不开启mock
  MOCK: false,
  // 默认mock前缀url
  MOCK_APPEND: '/mock',
  // 非mock前缀url
  DOMAIN: '',
  // 默认在组装完url后发起请求，传入的req会直接当作axios的对象，可以采用项目用到的request方法覆盖
  request (req) {
    if (!req.method || !req.url) {
      throw new Error('you start a wrong request!');
    }

    return new Promise((resolve, reject) => {
      axios({
        ...req
      })
        .then(data => {
          data.status === 200 ? resolve(data.data) : reject(data.statusText);
        })
        .catch(reject);
    });
  }
};
```

2. proxy

    通过proxy发起请求，自动选择加上或不加上mock

    * 参数： request: { url: String, methods: String, 其余见axios文档 }, options: { mock: Boolean, mockAppend: String, domain: String }, fn: Functions
    * 返回值： 若采用默认的request方法，返回一个promise；否则返回用户定义的request方法；若定义了fn，则返回值为undefined
    * 使用： 发送请求，对每个请求，优先采用自身的options，mock指请求是否默认采用mock，mockAppend指定默认的mock前缀，append指定默认的非mock请求前缀。若指定了fn，不会使用默认的request发送请求，而会将req作为fn的参数回调用