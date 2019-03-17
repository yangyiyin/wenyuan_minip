const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
    data:{
        class_homework_list:[],
        list_pull_info:'',
        classid:0,
        classname:'',
    },

    onLoad(option){
        this.setData({
            classid:option.classid,
            classname:option.classname,
        });
        this.get_class_homework_list(true).then(function(){
            this.setData({
                class_homework_list:this.data.list.class_homework_list.list,
                list_pull_info:this.data.list.class_homework_list.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },

    get_class_homework_list(init){
        return common.getlist('class_homework_list', {classid:this.data.classid}, 20, this, init);
    },
    onPullDownRefresh(){
        this.get_class_homework_list(true).then(function(){
            wx.stopPullDownRefresh()
            this.setData({
                class_homework_list:this.data.list.class_homework_list.list,
                list_pull_info:this.data.list.class_homework_list.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },
    onReachBottom(){
        this.get_class_homework_list().then(function(){
            this.setData({
                class_homework_list:this.data.list.class_homework_list.list,
                list_pull_info:this.data.list.class_homework_list.has_more ? '上拉加载更多' : '没有更多了'
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
    },
    goto_homework_detail(event){

        var id = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/homework_detail/index?id='+id
        });
    },
});