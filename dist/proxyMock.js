(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios')) :
  typeof define === 'function' && define.amd ? define(['exports', 'axios'], factory) :
  (factory((global.proxyMock = {}),global.axios));
}(this, (function (exports,axios) { 'use strict';

  axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  /**
   * 请求包装类
   * 如果process.env.NODE_ENV不是development不会开启mock
   */

  var OPTIONS = {
    // 默认开启mock
    MOCK: false,
    // mock前缀url
    MOCK_APPEND: '/mock',
    // 非mock前缀url
    DOMAIN: '',
    request: function request(req) {
      if (!req.method || !req.url) {
        throw new Error('you start a wrong request!');
      }

      return new Promise(function (resolve, reject) {
        axios(_extends({}, req)).then(function (data) {
          data.status === 200 ? resolve(data.data) : reject(data.statusText);
        }).catch(reject);
      });
    }
  };

  var ProxyMock = function () {
    function ProxyMock(options) {
      classCallCheck(this, ProxyMock);

      this.options = Object.assign({}, OPTIONS, options);
      this.process = process || window.process;
    }

    createClass(ProxyMock, [{
      key: 'setOptions',
      value: function setOptions(options) {
        Object.assign(this.options, options);
      }
    }, {
      key: 'combineRequest',
      value: function combineRequest(req) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$mock = _ref.mock,
            mock = _ref$mock === undefined ? this.options.MOCK : _ref$mock,
            _ref$mockAppend = _ref.mockAppend,
            mockAppend = _ref$mockAppend === undefined ? this.options.MOCK_APPEND : _ref$mockAppend,
            _ref$append = _ref.append,
            append = _ref$append === undefined ? this.options.DOMAIN : _ref$append;

        if (!req.url) {
          throw new ReferenceError('request must has url property!');
        }

        req.url = (mock && this.process && this.process.env && this.process.env.NODE_ENV === 'development' ? mockAppend : append) + req.url;
        return req;
      }

      /**
       * 发起请求，默认采用axios
       * @param {Object} req 默认采用axios发起请求
       * @param {Function} fn 回掉方法
       */

    }, {
      key: 'request',
      value: function request(req, fn) {
        fn && typeof fn === 'function' ? fn(req) : this.options.request(req);
      }
    }]);
    return ProxyMock;
  }();

  var proxyM = new ProxyMock();

  // function judge() {
  //   if (!proxyM) {
  //     throw new Error("must init mock proxy first!");
  //   }
  // }

  var proxy = {
    // 单例
    // getProxy(options) {
    //   return proxyM ? proxyM : new ProxyMock(options);
    // },
    setOptions: function setOptions(options) {
      // judge();
      proxyM.setOptions(options);
    },

    /**
     * 代理请求的接口
     * @param {Object} req 请求体 必须包含url；如果采用默认的请求方法，必须包含methods
     * @param {Object} options 可选，包含是否需要mock，append等
     * @param {*} fn
     */
    proxy: function proxy(req, options, fn) {
      // judge();
      return proxyM.request(proxyM.combineRequest(req, options), fn);
    }
  };

  exports.proxyMock = proxy;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
