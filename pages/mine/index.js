const app = getApp();
Page({
    data:{
        info:{
            avatar:'http://pbw56w09g.bkt.clouddn.com/切图_204.png',
            name:'王小明',
            studentid:'201845265'
        },
        visible:false,
        current_cut_img:''
    },
    onShow: function() {
        this.setData({
            current_cut_img:app.globalData.current_cut_img
        });
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
    }
});