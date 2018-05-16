/**
 * 请求包装类
 * 如果process.env.NODE_ENV不是development不会开启mock
 */
// TODO 请求的时候如果process.env.NODE_ENV是product的话不用mock

const OPTIONS = {
  // 默认开启mock
  MOCK: false,
  // mock前缀url
  MOCK_APPEND: "",
  // 非mock前缀url
  DOMAIN: "",
  request(req) {
    if (!req.method || !req.url) {
      throw new Error("you start a wrong request!");
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

let proxyM = new ProxyMock();

class ProxyMock {
  constructor(options) {
    this.options = Object.assign({}, OPTIONS, options);
  }

  setOptions(options) {
    Object.assign(this.options, options);
  }

  combineRequest(
    req,
    {
      mock = this.options.MOCK,
      mockAppend = this.options.MOCK_APPEND,
      append = this.options.DOMAIN
    } = {}
  ) {
    if (!req.url) {
      throw new ReferenceError("request must has url property!");
    }

    request.url =
      (mock && process.env.NODE_ENV === "development" ? mockAppend : append) +
      request.url;
    return request;
  }

  /**
   * 发起请求，默认采用axios
   * @param {Object} req 默认采用axios发起请求
   * @param {Function} fn 回掉方法
   */
  request(req, fn) {
    fn && typeof fn === "function" ? fn(req) : this.options.request(req);
  }
}

// function judge() {
//   if (!proxyM) {
//     throw new Error("must init mock proxy first!");
//   }
// }

export default {
  // 单例
  // getProxy(options) {
  //   return proxyM ? proxyM : new ProxyMock(options);
  // },
  setOptions(options) {
    // judge();
    proxyM.setOptions(options);
  },
  /**
   * 代理请求的接口
   * @param {Object} req 请求体 必须包含url；如果采用默认的请求方法，必须包含methods
   * @param {Object} options 可选，包含是否需要mock，append等
   * @param {*} fn
   */
  proxy(req, options, fn) {
    // judge();
    return proxyM.request(proxyM.combineRequest(req, options), fn);
  }
};
