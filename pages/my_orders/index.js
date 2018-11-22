const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const app = getApp()
Page({
    data:{
        anchor:'',
        fix_tabs:false,
        current_tab:1,
        show_comment:false,
        show_arrange:false,
        action:1,
        current:{}
    },
    onLoad(){


    },
    onShow(){
        this.setData({
            ready:false
        })
        this.get_my_order_list(true).then(function(){
            this.setData({
                ready:true
            })
        }.bind(this)).catch(function(){});
    },

    get_my_order_list(init){
      return common.getlist('my_order_list', {}, 10, this, init);
    },

    goto_detail(event){
        var id = event.currentTarget.dataset.id;
        var type = event.currentTarget.dataset.type;
        if (type == 1) {
            wx.navigateTo({
                url: '/pages/order_detail/index?id='+id
            })
        } else if(type==2) {
            wx.navigateTo({
                url: '/pages/sign_course_detail/index?order_id='+id
            })
        }

    },
    pay(event){
        var id = event.currentTarget.dataset.id;
        var index = event.currentTarget.dataset.index;
        var data = {
            id:id
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
                        if(_this.data.list.my_order_list.list[index]) {
                            _this.data.list.my_order_list.list[index].status = 2;
                            _this.data.list.my_order_list.list[index].status_desc = '已付款,等待签到';
                            _this.setData({
                                list:_this.data.list
                            })
                        }

                    },
                    'fail':function(ret){
                    }
                })

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },
    pay_sign_course(event){
        var id = event.currentTarget.dataset.id;
        var index = event.currentTarget.dataset.index;
        var data = {
            id:id
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
                        // _this.get_order_detail();
                        if(_this.data.list.my_order_list.list[index]) {
                            _this.data.list.my_order_list.list[index].status = 2;
                            _this.data.list.my_order_list.list[index].status_desc = '等待报名结果';
                            _this.setData({
                                list:_this.data.list
                            })
                        }

                    },
                    'fail':function(ret){
                    }
                })

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },
    cancel_order(event){
        wx.showModal({
            title: '提示',
            content: '确认取消订单?',
            success: function(res) {
                if (res.confirm) {
                    var id = event.currentTarget.dataset.id;
                    var index = event.currentTarget.dataset.index;
                    var data = {
                        id:id
                    };
                    common.request('post','cancel_order',data,function (res) {
                        if (res.data.code == common.constant.return_code_success) {
                            common.show_toast('取消成功!');
                            if(this.data.list.my_order_list.list[index]) {
                                this.data.list.my_order_list.list[index].status = 9;
                                this.data.list.my_order_list.list[index].status_desc = '已关闭';
                                this.setData({
                                    list:this.data.list
                                })
                            }

                        } else {
                            common.show_modal(res.data.msg);
                        }
                    }.bind(this));
                }
            }.bind(this)
        });



    },

    cancel_order_simple(event){
        wx.showModal({
            title: '提示',
            content: '确认取消订单?',
            success: function(res) {
                if (res.confirm) {
                    var id = event.currentTarget.dataset.id;
                    var index = event.currentTarget.dataset.index;
                    var data = {
                        id:id
                    };
                    common.request('post','cancel_sign_course',data,function (res) {
                        if (res.data.code == common.constant.return_code_success) {
                            common.show_toast('取消成功!');
                            if(this.data.list.my_order_list.list[index]) {
                                this.data.list.my_order_list.list[index].status = 9;
                                this.data.list.my_order_list.list[index].status_desc = '已关闭';
                                this.setData({
                                    list:this.data.list
                                })
                            }

                        } else {
                            common.show_modal(res.data.msg);
                        }
                    }.bind(this));
                }
            }.bind(this)
        });



    },

    comment(event){
        var goods_id = event.currentTarget.dataset.goods_id;
        var order_id = event.currentTarget.dataset.order_id;
        var index = event.currentTarget.dataset.index;
        this.setData({
            current_comment_goods_id:goods_id,
            current_comment_order_id:order_id,
            current_comment_index:index,
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
        if (this.data.current_comment_index || this.data.current_comment_index===0) {

        } else {
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
                if(this.data.list.my_order_list.list[this.data.current_comment_index]) {
                    this.data.list.my_order_list.list[this.data.current_comment_index].status = 4;
                    this.data.list.my_order_list.list[this.data.current_comment_index].status_desc = '已完成';
                    this.setData({
                        list:this.data.list
                    });
                }
                this.setData({
                    show_comment:false
                });

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));

    },

    onPullDownRefresh(){
        this.get_my_order_list(true).then(function(){
            this.setData({
                ready:true
            })
            wx.stopPullDownRefresh()

            this.setData({
                list_pull_info:this.data.list.course_list.has_more ? '上拉加载更多' : '没有更多了'

            })

        }.bind(this)).catch(function(){})
    },
    onReachBottom(){
        this.get_my_order_list().then(function(){
            this.setData({
                list_pull_info:this.data.list.course_list.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){});
    },

    show_course_arrange(e){
        var current = e.currentTarget.dataset.item;
        this.setData({
            current:current,
            show_arrange:true
        })
    }
    
});