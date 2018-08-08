Page({
    data:{
        list:[
            {title:'新生入学测试',label:'已报名',time:'考试时间另行通知',desc:'新生入学测试,新幼儿园大班(幼小衔接)...',cate:1,is_over:false},
            {title:'综合实验班招考',label:'已报名',time:'2018/08/16 08:30',desc:'新生入学测试,新幼儿园大班(幼小衔接)...',cate:1,is_over:false},
            {title:'五年级学期晋级考(下)',label:'',time:'2018/08/16 08:30',desc:'新生入学测试,新幼儿园大班(幼小衔接)...',cate:2,is_over:false},
            {title:'五年级学期晋级考(上)',label:'',time:'2018/08/16 08:30',desc:'新生入学测试,新幼儿园大班(幼小衔接)...',cate:1,is_over:true},
        ]
    },

    goto_detail() {
        wx.navigateTo({
            url: '/pages/examine_detail/index'
        })
    }
});