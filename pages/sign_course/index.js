const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const app = getApp()
Page({
    data:{
        student_list:'',
        loading_student_list:true,
        current_student:null,
        course_list:'',
        loading_course_list:true,

    },
    onLoad(){
        //获取学生列表
        this.get_sign_course_student_list().then(function(){
            //获取当前学生的可报名班级

        },function () {

        });
    },
    onShow(){

    },
    get_sign_course_student_list(){
        return new Promise(function(resolve,reject){
            common.request('post','get_sign_course_student_list',{},function (res) {
                if (res.data.code == common.constant.return_code_success) {
                    if (res.data.data.binds.length) {
                        res.data.data.binds[0].active = true;
                        var current_student = res.data.data.binds[0];
                    } else if (res.data.data.news.length) {
                        res.data.data.news[0].active = true;
                        var current_student = res.data.news.binds[0];
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

    get_sign_course_list(){
        common.request('post','get_sign_course_list',{},function (res) {
            if (res.data.code == common.constant.return_code_success) {
                if (!res.data.data.length) {
                    common.show_modal('对不起，系统没有查到当前学生可报班级信息');
                }
                this.setData({
                    course_list:res.data.data,
                    loading_course_list:false
                });
            } else {
                common.show_modal(res.data.msg);

            }

        }.bind(this));
    },
    onPullDownRefresh(){
        this.get_course_list(true).then(function(){
            this.setData({
                ready:true
            })
            wx.stopPullDownRefresh()
            this.data.list.course_list.list[0].active = true;
            this.setData({
                top_course_list:this.data.list.course_list.list.slice(0,3),
                swiper_info:this.data.list.course_list.list[0].title,
                list_pull_info:this.data.list.course_list.has_more ? '上拉加载更多' : '没有更多了'
            })

        }.bind(this)).catch(function(){})
    },
    
});