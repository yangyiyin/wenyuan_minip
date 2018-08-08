const app = getApp()
// const common = require('../../utils/common.js');
// const config = require('../../utils/config.js');
Page({
    data:{
        ready:false
    },
    onLoad() {
        //登录
        app.login().then(function(is_old){
            if (is_old) {
                app.get_userinfo().then(function(has_reg){

                    if (has_reg) {
                        this.goto_index();
                    } else {
                        this.goto_login();
                    }

                }.bind(this),function(){

                })
            } else {
                app.get_userinfo().then(function(has_reg){
                    if (has_reg) {
                        this.goto_index();
                    } else {
                        this.setData({
                            ready:true
                        })
                    }

                }.bind(this))
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