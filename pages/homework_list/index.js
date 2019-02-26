const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
    data:{
        news_list:[],
        list_pull_info:''
    },

    onLoad(){
        // this.get_news_list(true).then(function(){
        //     this.setData({
        //         news_list:this.data.list.news_list.list,
        //         list_pull_info:this.data.list.news_list.has_more ? '上拉加载更多' : '没有更多了'
        //     });
        // }.bind(this)).catch(function(){})
    },

    get_news_list(init){
        return common.getlist('news_list', {status:1}, 20, this, init);
    },
    onPullDownRefresh(){
        this.get_news_list(true).then(function(){
            wx.stopPullDownRefresh()
            this.setData({
                news_list:this.data.list.news_list.list,
                list_pull_info:this.data.list.news_list.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },
    onReachBottom(){
        this.get_news_list().then(function(){
            this.setData({
                news_list:this.data.list.news_list.list,
                list_pull_info:this.data.list.news_list.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },
    goto_news_detail(event){
        // if (event.currentTarget.dataset.link) {
        //     var link = event.currentTarget.dataset.link;
        // } else {
        //     var link = config.base_url_h5+'/apps/wenyuanjiaoyu/h5/news_info.php?id='+event.currentTarget.dataset.id;
        // }
        //
        // wx.navigateTo({
        //     url: '/pages/webview/index?link='+encodeURIComponent(link)
        // })
    }
});