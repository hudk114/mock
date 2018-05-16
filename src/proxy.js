/**
 * 请求包装类
 * 如果process.env.NODE_ENV不是development不会开启mock
 */
// TODO 请求的时候如果process.env.NODE_ENV是product的话不用mock
import axios from 'axios';

const OPTIONS = {
  // 默认不开启mock
  MOCK: false,
  // mock前缀url
  MOCK_APPEND: '/mock',
  // 非mock前缀url
  DOMAIN: '',
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

class ProxyMock {
  constructor (options) {
    this.options = Object.assign({}, OPTIONS, options);
    this.process = process || window.process;
  }

  setOptions (options) {
    Object.assign(this.options, options);
  }

  combineRequest (
    req,
    {
      mock = this.options.MOCK,
      mockAppend = this.options.MOCK_APPEND,
      domain = this.options.DOMAIN
    } = {}
  ) {
    if (!req.url) {
      throw new ReferenceError('request must has url property!');
    }

    if (!process) {
      req.url = (mock ? mockAppend : domain) + req.url;
    } else {
      req.url = (mock && process.env.NODE_ENV === 'development' ? mockAppend : domain) + req.url;
    }

    return req;
  }

  /**
   * 发起请求，默认采用axios
   * @param {Object} req 默认采用axios发起请求
   * @param {Function} fn 回调方法
   */
  request (req, fn) {
    fn && typeof fn === 'function' ? fn(req) : this.options.request(req);
  }
}

let proxyM = new ProxyMock();

export default {
  setOptions (options) {
    proxyM.setOptions(options);
  },
  /**
   * 代理请求的接口
   * @param {Object} req 请求体 必须包含url；如果采用默认的请求方法，必须包含methods
   * @param {Object} options 可选，包含是否需要mock，append等
   * @param {Function} fn 回调
   */
  proxy (req, options, fn) {
    return proxyM.request(proxyM.combineRequest(req, options), fn);
  }
};
