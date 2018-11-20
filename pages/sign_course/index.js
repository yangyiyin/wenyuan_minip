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
        stage_id:1

    },
    onLoad(){
        //获取学生列表
        this.get_sign_course_student_list().then(function(){
            //获取当前学生的可报名班级
            this.get_sign_class_list();
        }.bind(this),function () {

        });
    },
    onShow(){

    },
    get_sign_course_student_list(){
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
                stage_id:this.data.stage_id
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
            url: '/pages/sign_course_detail/index?id='+id
        });
    },
    choose_student(event){

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
    }
});