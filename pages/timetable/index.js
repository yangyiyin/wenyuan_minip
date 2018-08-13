const app = getApp()
const common = require('../../utils/common.js');
Page({
    data:{
        lession_list:[]
    },

    onLoad(){
        this.setData({
            lession_list: wx.getStorageSync('lession_list'),
            student_info:wx.getStorageSync('student_info')
        })
    },
    onShow(){
        if (app.globalData.to_refresh.timetable) {
            this.setData({
                ready: false
            })
            this.get_lession_time_list();
            app.globalData.to_refresh.timetable = false;
        }
    },
    get_lession_time_list(){
        common.request('post','get_lession_time_list',{},function (res) {
            if (res.data.code == common.constant.return_code_success) {
                if (res.data.data.student_info.avatar) {
                    res.data.data.student_info.avatar += '&i='+Math.random()
                }
                this.setData({
                    lession_list:res.data.data.lession_time,
                    student_info:res.data.data.student_info
                })
                setTimeout(function(){
                    this.setData({
                        ready:true
                    })
                }.bind(this), 100)
                wx.setStorageSync('lession_list', res.data.data.lession_time);
                wx.setStorageSync('student_info', res.data.data.student_info);
            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    }
    
});