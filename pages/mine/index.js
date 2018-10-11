const app = getApp();
const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
    data:{
        info:{
            avatar:'http://pbw56w09g.bkt.clouddn.com/切图_204.png',
            name:'王小明',
            studentid:'201845265'
        },
        userinfo:app.globalData.userInfo,
        visible:false,
        current_cut_img:''
    },
    onShow: function() {
        this.setData({
            userinfo:app.globalData.userInfo
        })
        this.setData({
            current_cut_img:app.globalData.current_cut_img
        });
        if (app.globalData.to_refresh.mine) {
            this.get_current_student();
            app.globalData.to_refresh.mine = false;
        }
    },
    goto_examine_log(){
        wx.navigateTo({
            url: '/pages/examine_log/index'
        })
    },
    goto_suggest(){
        wx.navigateTo({
            url: '/pages/suggest/index'
        })
    },
    goto_words(){
        wx.navigateTo({
            url: '/pages/words/index'
        })
    },
    show_change_avatar(){
        this.setData({
            info:this.data.info,
            visible:true
        })
    },
    get_current_student(){
        common.request('post','get_current_student',{},function (res) {
            if (res.data.code == common.constant.return_code_success) {
                if (res.data.data.avatar) {
                    res.data.data.avatar += '&i='+Math.random()
                }
                this.setData({
                    info:res.data.data
                });
                setTimeout(function(){
                    this.setData({
                        ready:true
                    })
                }.bind(this), 50)

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },
    change_avatar(){
        if (!this.data.current_cut_img) {
            this.setData({
                visible:false
            })
            return;
        }
        //上传
        wx.uploadFile({
            url: config.urls.change_avatar,
            filePath: this.data.current_cut_img,
            name: 'img',
            formData:{
                'user_session':app.globalData.user_session,
                'studentid' : this.data.info.studentid
            },
            success: function(res){
                app.globalData.current_cut_img = '';
                this.data.info.avatar = this.data.current_cut_img;
                this.setData({
                    visible:false,
                    info:this.data.info
                });
                app.globalData.to_refresh.index = true;
                app.globalData.to_refresh.timetable = true;
                app.globalData.to_refresh.mine = true;
            }.bind(this)
        });
    }
});