const common = require('../../utils/common.js');
Page({
    data:{
        list:[
            // {title:"四年级内部晋级考试",result:[{key:"总分",value:"280(语文90,数学100,英语90)"},{key:"结果",value:"晋级A班"}]},
            // {title:"四年级内部晋级考试2",result:[{key:"总分",value:"210(语文90,数学100,英语90)"},{key:"结果",value:"晋级A1班"}]},
            // {title:"四年级内部晋级考试3",result:[{key:"总分",value:"230(语文90,数学100,英语90)"},{key:"结果",value:"晋级A2班"}]},

        ],
        list_pull_info:''
    },
    onLoad(){
        this.get_list(true).then(function(){
            this.setData({
                list:this.data.list.get_current_student_examine_log.list,
                list_pull_info:this.data.list.get_current_student_examine_log.has_more ? '上拉加载更多' : '没有更多了'
            });
            setTimeout(function(){
                this.setData({
                    ready:true
                })
            }.bind(this), 50)
        }.bind(this)).catch(function(){})
    },

    get_list(init){
        return common.getlist('get_current_student_examine_log', {status:1}, 20, this, init);
    },
    onPullDownRefresh(){
        this.get_list(true).then(function(){
            wx.stopPullDownRefresh()
            this.setData({
                list:this.data.list.get_current_student_examine_log.list,
                list_pull_info:this.data.list.get_current_student_examine_log.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },
    onReachBottom(){
        this.get_list().then(function(){
            this.setData({
                list:this.data.list.get_current_student_examine_log.list,
                list_pull_info:this.data.list.get_current_student_examine_log.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },

    
});