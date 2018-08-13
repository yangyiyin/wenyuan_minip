
const config = require('./config.js');

var request_callback = function (res, app) {
    if (!app) {
        app = getApp();
    }
    if (res.data.code == constant.return_code_success) {
      // wx.showToast({
      //   title: res.data.message
      //
      // });
    } else {
        if (res.data.code == constant.return_code_error_login) {
            login_fix(app);
        } else {
            show_modal();
        }

    }
}


var check_session = function (app) {
    if (!app) {
        app = getApp();
    }
    if(!app.globalData.user_session) {
        login_fix(app);
    }
}

var login_fix = function(app) {
    show_toast('登录信息超时,重新登录中。。。');
    app.globalData.user_session = '';
    wx.setStorageSync('user_session','');
    app.login().then(function(){
        wx.reLaunch({
            url: '/pages/login/index'
        })
    });
}

var request = function (method,url,user_data,callback) {

    var app = getApp();
    var data = app.get_common_request_data();
    if (user_data) {
        for(var i in user_data) {
            data[i] = user_data[i];
        }
    }
    if (config.urls[url]) {
        url = config.urls[url];
    }

    wx.showNavigationBarLoading();
    wx.request({
        url: url,
        data:data,
        method:method,
        success: function(res) {
            //request_callback(res, app);
            callback(res);
        },
        fail: function(res) {
            console.log(res)
        },
        complete: function(res) {
            wx.hideNavigationBarLoading();
        }
    });
}

var getlist = function(url,param, _page_size,_this,init){

    return new Promise(function(resolve, reject){
        if (init) {
            _this.setData({
                page:1
            });
        } else {
            if (_this.data.list[url] && !_this.data.list[url].has_more) {
                show_modal('没有更多了~')
                reject();
            }
            _this.data.page = _this.data.page ? _this.data.page : 1;
            _this.setData({
                page:(_this.data.page+1)
            });
        }
        if (!_this.data.list) {
            _this.setData({
                list:{}
            });
        }
        var page_size = _page_size ? _page_size : 10;

        var app = getApp();
        var data = app.get_common_request_data();
        data.page = _this.data.page;
        data.page_size = page_size;
        if (param) {
            data = Object.assign(data, param);
        }
        request('post',url,data,function(res){
            check_session();
            if (res.data.code == constant.return_code_success) {

                _this.data.list[url] = _this.data.list[url] ? _this.data.list[url] : {};

                _this.data.list[url].list = (_this.data.list[url].list && !init) ? _this.data.list[url].list.concat(res.data.data.list) : res.data.data.list;
                _this.data.list[url].count = res.data.data.count;
                _this.data.list[url].has_more = res.data.data.has_more;
                _this.setData({
                    list:_this.data.list
                });
                resolve();
            } else {
                reject();
            }
        });

    })
}

var constant = {
    return_code_success:100,
    return_code_error:101,
    return_code_error_login:999,
}

var show_modal = function (msg) {
    wx.showModal({
        title: '',
        content: msg ? msg : '系统繁忙,请稍后再试',
        showCancel:false

    });
}

var show_toast = function (msg, icon) {

    wx.showToast({
        title: msg ? msg : '系统繁忙,请稍后再试',
        duration:2000,
        icon:icon ? icon : "none"
    });
}

module.exports = {
    request_callback: request_callback,
    check_session:check_session,
    request:request,
    constant:constant,
    show_modal:show_modal,
    show_toast:show_toast,
    getlist:getlist
}
