const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
    data:{
        type:'',
        news_list:[
            // {img:'http://wenyuanjiaoyu-qiniu.yixsu.com/img_loading_bg2.png','title':'速度快发货的时刻发挥第三方客户1'},
            // {img:'http://wenyuanjiaoyu-qiniu.yixsu.com/img_loading_bg2.png','title':'速度快发货的时刻发挥第三方客户2'},
            // {img:'http://wenyuanjiaoyu-qiniu.yixsu.com/img_loading_bg2.png','title':'速度快发货的时刻发挥第三方客户3'},
            // {img:'http://wenyuanjiaoyu-qiniu.yixsu.com/img_loading_bg2.png','title':'速度快发货的时刻发挥第三方客户4'},
            // {img:'http://wenyuanjiaoyu-qiniu.yixsu.com/img_loading_bg2.png','title':'速度快发货的时刻发挥第三方客户5'},

        ],
        new_list_top:[],
        swiper_info:'',
        list_pull_info:'',
        options_grade: [{label:'全部年级',value:'-1'},{label:'一年级',value:'一'},{label:'二年级',value:'二'},{label:'三年级',value:'三'},{label:'四年级',value:'四'},{label:'五年级',value:'五'},{label:'六年级',value:'六'},{label:'初一',value:'初一'}],
        options_subject: [{label:'语/数/外',value:'-1'},{label:'语文',value:'1'},{label:'数学',value:'2'},{label:'英语',value:'3'}],
        menuTop:0,
        option_index:{grade:0,subject:0},
        menuFixed:false
    },

    swiper_change(e){
        this.data.news_list.forEach(function (ele) {
            ele.active = false;
        })
        this.data.news_list[e.detail.current].active = true;
        this.setData({
            news_list:this.data.news_list,
            swiper_info:this.data.news_list[e.detail.current] ? this.data.news_list[e.detail.current].title : ' ',
        })
    },
    bindPickerChange(e) {
        var option = e.currentTarget.dataset.option;
        this.data.option_index[option] = e.detail.value;
        this.setData({
            option_index: this.data.option_index
        });
        this.get_news_list(true).then(function(){
            this.setData({
                news_list_top:this.data.list.video_list.list.slice(0,5),
                news_list:this.data.list.video_list.list,
                list_pull_info:this.data.list.video_list.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },
    onPageScroll: function (e) {

 // console.log(e.scrollTop);
        var that = this;
// 3.当页面滚动距离scrollTop > menuTop菜单栏距离文档顶部的距离时，菜单栏固定定位
        if ((e.scrollTop-50) > that.data.menuTop) {
            that.setData({
                menuFixed: true
            })
        } else {
            that.setData({
                menuFixed: false
            })

        }
    },
    onLoad(options){
        this.setData({
            type:options.type
        })
        this.get_news_list(true).then(function(){
            this.setData({
                news_list_top:this.data.list.video_list.list.slice(0,5),
                news_list:this.data.list.video_list.list,
                list_pull_info:this.data.list.video_list.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },

    get_news_list(init){

        return common.getlist('video_list', {...this.data.option_index,type:this.data.type}, 10, this, init);
    },
    onPullDownRefresh(){
        this.get_news_list(true).then(function(){
            wx.stopPullDownRefresh()
            this.setData({
                news_list_top:this.data.list.video_list.list.slice(0,5),
                news_list:this.data.list.video_list.list,
                list_pull_info:this.data.list.video_list.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },
    onReachBottom(){
        this.get_news_list().then(function(){
            this.setData({
                news_list:this.data.list.video_list.list,
                list_pull_info:this.data.list.video_list.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },
    goto_detail(event){
        //检测是否已购买
        if (event.currentTarget.dataset.item.is_buy) {
            wx.navigateTo({
                url: '/pages/video_detail/index?id='+event.currentTarget.dataset.id
            })
        } else {
            var _this = this;
            wx.showModal({
                title: '确认购买',
                content: '是否确认购买此视频?价格'+event.currentTarget.dataset.item.price+'元,有效期1年',
                success (res) {
                    if (res.confirm) {
                        _this.pay(event.currentTarget.dataset.item)
                    } else if (res.cancel) {

                    }
                }
            })
        }
    },
    pay(item){
        var data = {
            id:item.id
        };
        common.request('post','pay_create_video',data,function (res) {
            // console.log(res);
            if (res.data.code == common.constant.return_code_success) {
                // console.log(123);
                //调起支付
                var _this = this;
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
                                    wx.navigateTo({
                                        url: '/pages/video_detail/index?id='+data.id
                                    })
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
    },
});