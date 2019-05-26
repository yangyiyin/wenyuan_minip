const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({
    data:{
        list:[]
    },
    onLoad(option){
        //console.log(option.student);
        wx.showLoading({
            title: '获取报名须知',
        });
        common.request('post','user_notice_agreement_list',{mine:1,notice_type:1,notice_id:9},function (res) {
            wx.hideLoading();
            if (res.data.code == common.constant.return_code_success) {
                this.setData({
                    list:res.data.data
                });

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));

    },
    onShow(){


    },

    goto_detail(event){
        var id = event.currentTarget.dataset.item.id;
        var student_name = event.currentTarget.dataset.item.student_name;
        wx.navigateTo({
            url: '/pages/sign_course_agreement/index?id='+id+'&is_agree=1&is_show_only=1&student_name='+student_name
        })
    },

});