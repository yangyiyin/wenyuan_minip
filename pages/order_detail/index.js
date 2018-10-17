const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const app = getApp()
Page({
    data:{
        anchor:'',
        fix_tabs:false,
        current_tab:1,
        show_comment:false,
        action:1,
        id:0,
        detail:null,
    },
    onLoad(option){
        if(option.msg) {
            common.show_toast(option.msg);
        }
        this.setData({
            ready:false,
            id:option.id
        })
        this.get_order_detail();

    },
    onShow(){


    },
    get_order_detail(){
        common.request('post','get_order_detail',{id:this.data.id},function (res) {
            this.setData({
                ready:true
            })
            if (res.data.code == common.constant.return_code_success) {
                this.setData({
                    detail:res.data.data
                });
            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },

    pay(){
        var data = {
            id:this.data.id
        };
        common.request('post','pay_create_course_order',data,function (res) {
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
                        // _this.get_order_detail();
                        wx.redirectTo({
                            url: '/pages/pay_success/index?id='+_this.data.id
                        })
                    },
                    'fail':function(ret){
                    }
                })

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },
    comment(event){
        var goods_id = event.currentTarget.dataset.goods_id;
        var order_id = event.currentTarget.dataset.order_id;
        this.setData({
            current_comment_goods_id:goods_id,
            current_comment_order_id:order_id,
            show_comment:true
        });
    },
    tapInputComment(e){
        this.setData({
            inputcomment: e.detail.value
        });

    },
    submit_comment(){
        if (!this.data.current_comment_goods_id) {
            common.show_modal('页面失效,请刷新页面');
            return;
        }
        if (!this.data.current_comment_order_id) {
            common.show_modal('页面失效,请刷新页面');
            return;
        }

        if (!this.data.inputcomment) {
            common.show_modal('请输入内容');
            return;
        }

        var data = {
            goods_id:this.data.current_comment_goods_id,
            order_id:this.data.current_comment_order_id,
            content:this.data.inputcomment
        };
        common.request('post','comment_goods',data,function (res) {
            if (res.data.code == common.constant.return_code_success) {
                common.show_toast('评价成功!');
                this.setData({
                    show_comment:false
                });
                this.get_order_detail();

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));

    },
    cancel_order(){

        wx.showModal({
            title: '提示',
            content: '确认取消订单?',
            success: function(res) {
                if (res.confirm) {
                    var data = {
                        id:this.data.id
                    };
                    common.request('post','cancel_order',data,function (res) {
                        if (res.data.code == common.constant.return_code_success) {
                            common.show_toast('取消成功!');
                            this.get_order_detail();
                        } else {
                            common.show_modal(res.data.msg);
                        }
                    }.bind(this));
                }
            }.bind(this)
        });
    }
    
});