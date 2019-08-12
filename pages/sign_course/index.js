const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const app = getApp()
Page({
    data:{
        student_list:{
            binds:[],
            news:[]
        },
        loading_student_list:true,
        current_student:null,
        course_list:'',
        stage:'',
        loading_course_list:true,
        stage_id:0,
        options_grade: [{label:'全部年级',value:'-1'},{label:'一年级',value:'一'},{label:'二年级',value:'二'},{label:'三年级',value:'三'},{label:'四年级',value:'四'},{label:'五年级',value:'五'},{label:'六年级',value:'六'},{label:'初一',value:'初一'}],
        options_subject: [{label:'语/数/外',value:'-1'},{label:'语文',value:'语文'},{label:'数学',value:'数学'},{label:'英语',value:'英语'}],
        options_level: [{label:'基础/提高/加强/全部',value:'-1'},{label:'基础',value:'基础'},{label:'提高',value:'提高'},{label:'加强',value:'加强'}],
        options_week: [{label:'周五至周日',value:'-1'},{label:'周五',value:'五'},{label:'周六',value:'六'},{label:'周日',value:'日'}],
        options_day: [{label:'上午/下午/晚上',value:'-1'},{label:'上午',value:'上午'},{label:'下午',value:'下午'},{label:'晚上',value:'晚上'}],
        menuTop:0,
        option_index:{grade:0,subject:0,level:0,week:0,day:0,}
    },
    onLoad(option){
        this.setData({
            stage_id:option.id?option.id:0
        })
        //获取学生列表
        this.get_sign_course_student_list().then(function(){
            //获取当前学生的可报名班级
            this.get_sign_class_list();
        }.bind(this),function () {

        });
    },
    onShow(){

    },
    init_menu_top(){
        var that = this;

        var query = wx.createSelectorQuery()//创建节点查询器 query

        query.select('#affix').boundingClientRect()//这段代码的意思是选择Id= the - id的节点，获取节点位置信息的查询请求

        query.exec(function (res) {

            console.log(res[0].top); // #affix节点的上边界坐

            that.setData({

                menuTop: res[0].top

            })

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

    get_sign_course_student_list(){
        this.setData({
            option_index:{grade:0,subject:0,level:0,week:0,day:0}
        })
        return new Promise(function(resolve,reject){
            this.setData({
                loading_student_list:true
            });
            common.request('post','get_sign_course_student_list',{},function (res) {
                if (res.data.code == common.constant.return_code_success) {
                    if (res.data.data.binds.length) {
                        res.data.data.binds[0].active = true;
                        var current_student = res.data.data.binds[0];
                    } else if (res.data.data.news.length) {
                        res.data.data.news[0].active = true;
                        var current_student = res.data.data.news[0];
                    } else {
                        var current_student = null;
                        common.show_modal('对不起，系统没有查到您可报班的学生信息，如有疑问请咨询官方客服');
                        reject();
                    }
                    this.setData({
                        student_list:res.data.data,
                        loading_student_list:false,
                        current_student:current_student
                    });
                    this.init_menu_top();
                    resolve();
                } else {
                    common.show_modal(res.data.msg);
                    reject();
                }

            }.bind(this));
        }.bind(this))

    },

    get_sign_class_list(){
        return new Promise(function(resolve,reject){
            var data = {
                student:this.data.current_student,
                stage_id:this.data.stage_id,
                option_grade:this.data.options_grade[this.data.option_index.grade].value,
                option_subject:this.data.options_subject[this.data.option_index.subject].value,
                option_level:this.data.options_level[this.data.option_index.level].value,
                option_week:this.data.options_week[this.data.option_index.week].value,
                option_day:this.data.options_day[this.data.option_index.day].value,
            }
            this.setData({
                loading_course_list:true
            })
            //console.log(data);
            common.request('post','get_sign_class_list',data,function (res) {
                if (res.data.code == common.constant.return_code_success) {
                    if (!res.data.data.classes.length) {
                        common.show_modal('对不起，系统没有查到当前学生可报班级信息');
                    }
                    this.setData({
                        course_list:res.data.data.classes,
                        stage:res.data.data.stage,
                        loading_course_list:false
                    });
                } else {
                    common.show_modal(res.data.msg);

                }
                resolve();
            }.bind(this));
        }.bind(this))
    },
    onPullDownRefresh(){

        //获取学生列表
        this.get_sign_course_student_list().then(function(){
            //获取当前学生的可报名班级
            this.get_sign_class_list().then(function(){
                wx.stopPullDownRefresh();
            });
        }.bind(this),function () {

        });

    },
    goto_detail(event){
        var id = event.currentTarget.dataset.id;
        app.globalData.sign_course_current_student = this.data.current_student;
        wx.navigateTo({
            url: '/pages/sign_course_detail/index?id='+id+'&stage_id='+this.data.stage_id
        });
    },
    choose_student(event){
        this.setData({
            option_index:{grade:0,subject:0,level:0,week:0,day:0}
        })
        var student = event.currentTarget.dataset.student;
        var index = event.currentTarget.dataset.index;
        var li = event.currentTarget.dataset.li;
        if (this.data.student_list.binds && this.data.student_list.binds.length) {
            this.data.student_list.binds.forEach(function(val){
                val.active = false;
            })
        }
        if (this.data.student_list.news && this.data.student_list.news.length) {
            this.data.student_list.news.forEach(function(val){
                val.active = false;
            })
        }

        this.data.student_list[li][index].active=true;
        //console.log(this.data.student_list);
        this.setData({
            current_student:this.data.student_list[li][index],
            student_list:this.data.student_list
        });
        this.get_sign_class_list();
    },
    bindPickerChange(e) {
        var option = e.currentTarget.dataset.option;
        this.data.option_index[option] = e.detail.value;
        this.setData({
            option_index: this.data.option_index
        });
        //获取当前学生的可报名班级
        this.get_sign_class_list();
    },
});