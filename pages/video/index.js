const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
    data:{
        news_list:[
            {img:'http://wenyuanjiaoyu-qiniu.yixsu.com/img_loading_bg2.png','title':'速度快发货的时刻发挥第三方客户1'},
            {img:'http://wenyuanjiaoyu-qiniu.yixsu.com/img_loading_bg2.png','title':'速度快发货的时刻发挥第三方客户2'},
            {img:'http://wenyuanjiaoyu-qiniu.yixsu.com/img_loading_bg2.png','title':'速度快发货的时刻发挥第三方客户3'},
            {img:'http://wenyuanjiaoyu-qiniu.yixsu.com/img_loading_bg2.png','title':'速度快发货的时刻发挥第三方客户4'},
            {img:'http://wenyuanjiaoyu-qiniu.yixsu.com/img_loading_bg2.png','title':'速度快发货的时刻发挥第三方客户5'},

        ],
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
    // onLoad(){
    //     this.get_news_list(true).then(function(){
    //         this.setData({
    //             news_list:this.data.list.news_list.list,
    //             list_pull_info:this.data.list.news_list.has_more ? '上拉加载更多' : '没有更多了'
    //         });
    //     }.bind(this)).catch(function(){})
    // },
    //
    // get_news_list(init){
    //     return common.getlist('news_list', {status:1}, 20, this, init);
    // },
    // onPullDownRefresh(){
    //     this.get_news_list(true).then(function(){
    //         wx.stopPullDownRefresh()
    //         this.setData({
    //             news_list:this.data.list.news_list.list,
    //             list_pull_info:this.data.list.news_list.has_more ? '上拉加载更多' : '没有更多了'
    //         });
    //     }.bind(this)).catch(function(){})
    // },
    // onReachBottom(){
    //     this.get_news_list().then(function(){
    //         this.setData({
    //             news_list:this.data.list.news_list.list,
    //             list_pull_info:this.data.list.news_list.has_more ? '上拉加载更多' : '没有更多了'
    //         });
    //     }.bind(this)).catch(function(){})
    // },
    // goto_news_detail(event){
    //     if (event.currentTarget.dataset.link) {
    //         var link = event.currentTarget.dataset.link;
    //     } else {
    //         var link = config.base_url_h5+'/apps/wenyuanjiaoyu/h5/news_info.php?id='+event.currentTarget.dataset.id;
    //     }
    //
    //     wx.navigateTo({
    //         url: '/pages/webview/index?link='+encodeURIComponent(link)
    //     })
    // }
});