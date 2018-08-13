const common = require('../../utils/common.js');
Page({
    data:{
        list:[
            // {content:"克里斯丁积分来看时代峻峰来看束带结发抗衰老的积分科技发大水六块腹肌了上岛咖啡就克里斯丁积分速度快积分克里斯丁附近开始的减肥来看时代峻峰考虑1"},
            // {content:"克里斯丁积分来看时代峻峰来看束带结发抗衰老的积分科技发大水六块腹肌了上岛咖啡就克里斯丁积分速度快积分克里斯丁附近开始的减肥来看时代峻峰考虑2"},
            // {content:"克里斯丁积分来看时代峻峰来看束带结发抗衰老的积分科技发大水六块腹肌了上岛咖啡就克里斯丁积分速度快积分克里斯丁附近开始的减肥来看时代峻峰考虑3"}
        ],
        list_pull_info:''
    },
    onLoad(){
        this.get_list(true).then(function(){
            this.setData({
                list:this.data.list.get_my_words.list,
                list_pull_info:this.data.list.get_my_words.has_more ? '上拉加载更多' : '没有更多了'
            });
            setTimeout(function(){
                this.setData({
                    ready:true
                })
            }.bind(this), 50)
        }.bind(this)).catch(function(){})
    },

    get_list(init){
        return common.getlist('get_my_words', {status:1}, 20, this, init);
    },
    onPullDownRefresh(){
        this.get_list(true).then(function(){
            wx.stopPullDownRefresh()
            this.setData({
                list:this.data.list.get_my_words.list,
                list_pull_info:this.data.list.get_my_words.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },
    onReachBottom(){
        this.get_list().then(function(){
            this.setData({
                list:this.data.list.get_my_words.list,
                list_pull_info:this.data.list.get_my_words.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },
    
});