import L from 'leaflet'
import $ from 'jquery'

export var Ajax = L.Class.extend({

  _timeout: 60000,

  _defs: [],

  initialize: function () {
    this._timeout = 60000;
    this._defs = [];
  },

  setTimeout: function (milliseconds) {
    this._timeout = milliseconds;
    return this;
  },

  getDefs: function () {
    return this._defs;
  },

  abort: function () {
    for(var i = 0, len = this._defs.length; i < len; i++) {
      if(this._defs[i]) { this._defs[i].abort(); }
    }
    this._defs = [];
  },

  get: function (url, data, async, context, success, error) {
    if(!error) error = this.error;
    if(!this._isCrossDomain(url)) {
      return this._request({
        url: url,
        data: data,
        async: async,
        dataType: 'json',
        type: 'GET',
        context: context,
        contentType: 'application/x-www-form-urlencoded;',
        success: success,
        error: error

      });
    } else {
      return this.request(url, data, async, context, success, error);
    }
  },

  post: function (url, data, async, context, success, error) {
    if(!error) error = this.error;
    if(this._isCrossDomain(url))
      url = Project_ParamConfig.defaultAjaxProxy + '?' + url;
    return this._request({
      url: url,
      data: data,
      async: async,
      dataType: 'json',
      type: 'POST',
      context: context,
      contentType: "application/x-www-form-urlencoded;",
      success: success,
      error: error
    });
  },

  put: function (url, data, async, context, success, error) {
    if(!error) error = this.error;
    return $.ajax({
      url: url,
      data: data,
      async: async,
      context: context,
      dataType: 'text',
      type: 'PUT',
      timeout: this._timeout,
      cache: false,
      success: success,
      error: error

    });
  },

  request: function (url, data, async, context, success, error) {
    if(!error) error = this.error;
    if(!$.isEmptyObject(data)) url = url + "?" + $.param(data);
    return this._request({
      url: url,
      async: async,
      context: context,
      dataType: 'jsonp',
      type: 'GET',
      contentType: "application/x-www-form-urlencoded;",
      success: success,
      error: error,
      timeout: this._timeout
    });
  },

  _removeDef: function (def) {
    for(var i = 0; i < this._defs.length; i++) {
      if(this._defs[i] === def)
        this._defs.splice(i, 1);
    }
  },

  _isSamePort: function (url) {
    var curPort = window.location.port;
    var targetPort = url.split('/')[2].split(":")[1];
    return curPort === targetPort;
  },

  _isCrossDomain: function (url) {
    if(url.indexOf("http") == -1) return false;
    if(!this._isSamePort(url)) return true;
    var curHost = window.location.hostname;
    var targetHost = url.split('/')[2].split(':')[0];
    return curHost.toLowerCase() !== targetHost.toLowerCase();
  },

  _request: function (options) {
    var deferred;
    try {
      var _this = this;
      if(!options.error) options.error = _this.error;
      deferred = $.ajax({
        url: options.url,
        data: options.data,
        dataType: options.dataType,
        type: options.type,
        contentType: "application/x-www-form-urlencoded",
        async: options.async,
        cache: false,
        context: options.context,
        timeout: _this._timeout
      });
      /*
       * 不管成功或失败，均调用第一个回调函数，这样就可以省去传入失败的回调函数
       * 如果传入了失败的回调函数，也同样可以执行。
       */
      deferred.then(function (res) {
        _this._removeDef(deferred);
        try {
          if(options.type !== "text" && typeof res === "string")
            res = $.parseJSON(res);
        } catch(e) {
          console.log(e.message);
        }
        options.success.call(options.context, res || {}, null);
      }, function (e) {
        _this._removeDef(deferred);
        options.success.call(options.context, null, e || {});
        options.error.call(options.context, e);
      });
      this._defs.push(deferred);
    } catch(e) {
      console.log(e.message);
    }
    return deferred;
  },

  error: function (e) {
    console.log(e.message);
  }
});
