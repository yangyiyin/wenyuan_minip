const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
    data:{
        platform:'',
        url:'',
        loading:true,
        id:0,
        video:{}
    },


    onLoad(options){
         // console.log(options);
        this.setData({id:options.id})
        common.request('post','video_url',{id:options.id}, (res) => {
            this.setData({video:res.data.data})
        });
        wx.getSystemInfo({
                success : (res) => {
                    // console.log(res.platform);
                    this.setData({
                    platform:res.platform
                })
            }
        })

    },
    bindwaiting(){
        //this.setData({loading:true})
    },
    bindplay(){
        this.setData({loading:false})
    },
    bindplay_preview(){
        this.setData({loading:false})
    },
    collect(){
        if (!this.data.id) {
            return;
        }
        var _this=this;
        common.request('post','user_video_collect',{id:this.data.id}, (res) => {
            // console.log(res);
            if (res.data.code == common.constant.return_code_success) {
                _this.data.video.is_collect = res.data.data;
                _this.setData({video:_this.data.video})
            } else {
                common.show_modal(res.data.msg);
            }
        });
    },
    onShareAppMessage: function (res) {

        return {
            title: this.data.video.title,
            path: '/page/video_detail/index?id='+this.data.video.id
        }
    },
    pay(event){

        if (this.data.platform == 'ios') {
            return;
        }
        var _this = this;
        wx.showModal({
            title: '确认购买',
            content: '是否确认购买此视频?价格'+event.currentTarget.dataset.item.price+'元,有效期1年',
            success (res) {
                if (res.confirm) {
                    var item = event.currentTarget.dataset.item;
                    var data = {
                        id:item.id
                    };
                    common.request('post','pay_create_video',data,function (res) {
                        // console.log(res);
                        if (res.data.code == common.constant.return_code_success) {
                            // console.log(123);
                            //调起支付
                            // var _this = this;
                            wx.requestPayment({
                                'timeStamp': String(res.data.data.timeStamp),
                                'nonceStr': res.data.data.nonceStr,
                                'package': res.data.data.package,
                                'signType':res.data.data.signType,
                                'paySign': res.data.data.sign,
                                'success':function(ret){
                                    wx.showModal({
                                        title: '购买成功',
                                        content: '购买成功,是否立即观看?',
                                        success (res) {
                                            if (res.confirm) {
                                                // wx.navigateTo({
                                                //     url: '/pages/video_detail/index?id='+data.id
                                                // })
                                                common.request('post','video_url',{id:_this.data.id}, (res) => {
                                                    _this.setData({video:res.data.data})
                                                });
                                            } else if (res.cancel) {

                                            }
                                        }
                                    })


                                },
                                'fail':function(ret){
                                }
                            })

                        } else {
                            common.show_modal(res.data.msg);
                        }
                    }.bind(this));
                } else if (res.cancel) {

                }
            }
        })
    },
});