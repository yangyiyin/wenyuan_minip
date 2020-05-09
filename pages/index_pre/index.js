const app = getApp()
const common = require('../../utils/common.js');
// const config = require('../../utils/config.js');
Page({
    data:{
        ready:false
    },
    onLoad(options) {
         if (options.q) {
             var url = decodeURIComponent(options.q);//url

             var query = common.getQueryVariable(url);//url后的参数
             // console.log(query)
             if (query.page) {
                 var param = [];
                 for(var i in query) {
                     if (i != 'page') {
                         param.push(i + '=' +query[i]);
                     }
                 }
                 app.globalData.page_url = param.length ? query.page + '?' + param.join('&') : query.page;
             }
         } else {
             app.globalData.page_url = '';
         }

         // console.log(app.globalData.page_url);
        //登录
        app.login().then(function(is_old){
            if (is_old) {
                app.get_userinfo().then(function(has_reg){

                    if (has_reg) {
                        if (app.globalData.page_url) {
                            if (app.globalData.page_url == '/pages/video/index') {
                                wx.switchTab({
                                    url: app.globalData.page_url
                                })
                            } else {
                                wx.redirectTo({
                                    url: app.globalData.page_url
                                })
                            }
                        } else {
                            this.goto_index();
                        }

                    } else {
                        this.goto_login();
                    }

                }.bind(this),function(msg){
                    common.show_modal(msg)
                })
            } else {
                app.get_userinfo().then(function(has_reg){
                    if (has_reg) {
                        if (app.globalData.page_url) {
                            if (app.globalData.page_url == '/pages/video/index') {
                                wx.switchTab({
                                    url: app.globalData.page_url
                                })
                            } else {
                                wx.redirectTo({
                                    url: app.globalData.page_url
                                })
                            }
                        } else {
                            this.goto_index();
                        }
                        //this.goto_index();
                    } else {
                        this.setData({
                            ready:true
                        })
                    }

                }.bind(this),function(msg){
                    common.show_modal(msg)
                })
            }

        }.bind(this));
    },
    goto_login() {
        wx.redirectTo({
            url: '/pages/login/index'
        })
    },
    goto_index() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    }
});