const app = getApp();
Page({
    data:{
        info:{
            title:'五年级内部晋级考试',
            time:'2018/08/16 08:30',
            sign_over_time:'2018/08/11 08:30',
            desc:"    圣诞节福利交水电费离开家圣诞快乐附近多少\n了看风景的克里斯积分克里斯多夫几点开始立即",
            signs:[
              //  {name:'王小明',result:[{key:'考场',value:'文远恤衫校区 25号教室'},{key:'考号',value:'20180806'}]},
              //  {name:'王小明2',result:[{key:'考场2',value:'文远恤衫校区 25号教室2'},{key:'考号2',value:'20180806'}, {key:'总评',value:'晋级B版'},{key:'总评',value:'晋级B版'},{key:'总评',value:'晋级B版'},{key:'总评',value:'晋级B版'},{key:'总评',value:'晋级B版'}]}
            ],
            pay_sum:0,
            type:1
        },
        current_cut_img:'',
        visible:false,
        options_grade:[
            {id:1,name:'一年级'},{id:2,name:'二年级'},{id:3,name:'三年级'}
        ],
        options_lession:[
            {id:1,name:'数学'},{id:2,name:'英语唐'},{id:3,name:'语文'}
        ],
        options_address:[
            {id:1,name:'观察'},{id:2,name:'浒山'}
        ],
        options_student:[
            {id:1,name:'杨益银'},{id:2,name:'杨益银2'},{id:-1,name:'新增学生'}
        ],
        select_options_grade:[],
        select_options_lession:[],
        select_options_address:[],
        select_options_student:[],
        current_student:{id:1,name:'杨益银',studentid:"23018120"},
        step:1,
    },
    onShow: function() {
        this.setData({
            current_cut_img:app.globalData.current_cut_img
        });
        if (app.globalData.current_cut_img) {
            this.setData({
                inputupload_error:''
            })
        }
    },
    init(){
        this.setData({
            current_cut_img:'',
            options_grade:[
                {id:1,name:'一年级'},{id:2,name:'二年级'},{id:3,name:'三年级'}
            ],
            options_lession:[
                {id:1,name:'数学'},{id:2,name:'英语唐'},{id:3,name:'语文'}
            ],
            options_address:[
                {id:1,name:'观察'},{id:2,name:'浒山'}
            ],
            options_student:[
                {id:1,name:'杨益银'},{id:2,name:'杨益银2'},{id:-1,name:'新增学生'}
            ],
            inputname:'',
            inputschool:'',
            inputschool_before:'',
            inputprise_before:'',
            select_options_grade:[],
            select_options_lession:[],
            select_options_address:[],
            select_options_student:[],
            inputphone1:'',
            inputphone2:'',
            current_student:{}

        })
    },
    show_sign() {
        this.init();
        this.setData({
            visible:true
        })
    },
    select_grade(e){
        this.setData({
            select_options_grade:e.detail.select_options
        });
        if (e.detai.select_options) {
            this.setData({
                inputgrade_error:''
            })
        }
    },
    select_lession(e){
        this.setData({
            select_options_lession:e.detail.select_options
        })
        if (e.detai.select_options) {
            this.setData({
                inputlession_error:''
            })
        }
    },
    select_address(e){
        this.setData({
            select_options_address:e.detail.select_options
        })
        if (e.detai.select_options) {
            this.setData({
                inputaddress_error:''
            })
        }
    },
    select_student(e){
        this.setData({
            select_options_student:e.detail.select_options
        })
        if (e.detai.select_options) {
            this.setData({
                inputstudent_error:''
            })
        }
    },

    bindinputname() {
        this.setData({
            inputname: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputname_error:''
            })
        }
    },
    bindinputschool() {
        this.setData({
            inputschool: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputschool_error:''
            })
        }
    },
    bindinputschool_before() {
        this.setData({
            inputschool_before: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputschool_before_error:''
            })
        }
    },
    bindinputprise_before() {
        this.setData({
            prise_before: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                prise_before_error:''
            })
        }
    },
    bindinputphone1() {
        this.setData({
            inputphone1: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputphone1_error:''
            })
        }
    },
    bindinputphone2() {
        this.setData({
            inputphone2: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputphone2_error:''
            })
        }
    }
});