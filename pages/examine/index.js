const common = require('../../utils/common.js');
const app = getApp()
Page({
    data:{
        examinations:[
            // {title:'新生入学测试',label:'已报名',time:'考试时间另行通知',desc:'新生入学测试,新幼儿园大班(幼小衔接)...',cate:1,is_over:false},
            // {title:'综合实验班招考',label:'已报名',time:'2018/08/16 08:30',desc:'新生入学测试,新幼儿园大班(幼小衔接)...',cate:1,is_over:false},
            // {title:'五年级学期晋级考(下)',label:'',time:'2018/08/16 08:30',desc:'新生入学测试,新幼儿园大班(幼小衔接)...',cate:2,is_over:false},
            // {title:'五年级学期晋级考(上)',label:'',time:'2018/08/16 08:30',desc:'新生入学测试,新幼儿园大班(幼小衔接)...',cate:1,is_over:true},
        ]
    },

    onLoad(){
        // this.get_list(true).then(function(){
        //     this.setData({
        //         examinations:this.data.list.get_student_examinations.list,
        //         list_pull_info:this.data.list.get_student_examinations.has_more ? '上拉加载更多' : '没有更多了',
        //     });
        //     setTimeout(function(){
        //         this.setData({
        //             ready:true
        //         })
        //     }.bind(this), 100)
        // }.bind(this)).catch(function(){})
    },
    onShow() {
        if (app.globalData.to_refresh.examine) {
            this.setData({
                ready:false
            });
            this.get_list(true).then(function(){
                this.setData({
                    examinations:this.data.list.get_student_examinations.list,
                    list_pull_info:this.data.list.get_student_examinations.has_more ? '上拉加载更多' : '没有更多了',
                });
                setTimeout(function(){
                    this.setData({
                        ready:true
                    })
                }.bind(this), 100)
            }.bind(this)).catch(function(){});
            app.globalData.to_refresh.examine = false;
        }

    },
    get_list(init){
        return common.getlist('get_student_examinations', {status:1}, 20, this, init);
    },
    onPullDownRefresh(){
        this.get_list(true).then(function(){
            wx.stopPullDownRefresh()
            this.setData({
                examinations:this.data.list.get_student_examinations.list,
                list_pull_info:this.data.list.get_student_examinations.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },
    onReachBottom(){
        this.get_list().then(function(){
            this.setData({
                examinations:this.data.list.get_student_examinations.list,
                list_pull_info:this.data.list.get_student_examinations.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },
    goto_detail(event) {
        var id = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/examine_detail/index?id='+id
        });
    }
});