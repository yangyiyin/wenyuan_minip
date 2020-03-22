const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
    data:{
        url:'',
        loading:false,
        id:0,
        video:{}
    },


    onLoad(options){
         // console.log(options);
        this.setData({id:options.id})
        common.request('post','video_url',{id:options.id}, (res) => {
            this.setData({video:res.data.data})
        });
    },
    bindwaiting(){
        this.setData({loading:true})
    },
    bindwaiting(){
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
    }
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
});