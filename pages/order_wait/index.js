const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const util = require('../../utils/util.js');
const app = getApp()

Page({
    data:{
        order_id:0
    },
    onLoad(option){

        if (!app.globalData.sign_course_order_data) {
            common.show_modal('请求数据有误,请返回');
        } else {

        }

    },
    _submit(data){
        common.request('post','add_order_sign_course',app.globalData.sign_course_order_data,function (res) {
            if (res.data.code == common.constant.return_code_success) {
                //判断是否等待
                if(res.data.data.is_wait) {

                } else {
                    this.setData({
                        order_id:res.data.data
                    })
                    //创建支付
                    this.pay();
                }
            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },

    pay(){
        var order_id = this.data.order_id
        var data = {
            id:order_id
        };
        common.request('post','pay_create_sign_course_order',data,function (res) {
            if (res.data.code == common.constant.return_code_success) {
                //调起支付
                var _this = this;
                wx.requestPayment({
                    'timeStamp': String(res.data.data.timeStamp),
                    'nonceStr': res.data.data.nonceStr,
                    'package': res.data.data.package,
                    'signType':res.data.data.signType,
                    'paySign': res.data.data.sign,
                    'success':function(ret){
                        common.show_toast('支付成功');
                        //回退
                        app.globalData.sign_course_order_id = order_id;
                        app.globalData.sign_course_order_success = true;
                        wx.navigateBack({
                            delta: 1
                        })
                    },
                    'fail':function(ret){
                    }
                })

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    }
});