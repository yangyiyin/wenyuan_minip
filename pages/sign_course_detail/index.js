const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({
    data:{
        id:0,
        student:{},
        class_info:{},
        from:'',
        current_cut_img:'',
        is_need_upload_avatar:false
    },
    onLoad(option){
        //console.log(option.student);
        this.setData({
            ready:false,
            id:option.id,
            from:option.from ? option.from : '',
            student:app.globalData.sign_course_current_student,
            is_new:app.globalData.sign_course_current_student.student_info ? true : false
        });
        if (this.data.is_new) {//如果是新生，则设置头像显示
            this.setData({
                current_cut_img:this.data.student.avatar
            });
        }
        this.get_class_info().then(function(){
            this.setData({
                ready:true
            });
        }.bind(this))
        // console.log(app.globalData.sign_course_current_student);
        // this.get_bind_students();
        // this.get_goods_detail();
        // this.get_goods_comment_list(true);
    },
    onShow(){
        if (app.globalData.current_cut_img) {
            this.setData({
                current_cut_img:app.globalData.current_cut_img
            });
            this.data.student.avatar = app.globalData.current_cut_img;
            this.setData({
                student:this.data.student,
                is_need_upload_avatar:true,
                inputupload_error:''
            });
        }

    },
    //获取班级信息
    get_class_info(){
        return new Promise(function(resolve,reject){
            var data = {
                id:this.data.id,
                student:this.data.student
            }
            //console.log(data);
            common.request('post','get_class_info',data,function (res) {
                if (res.data.code == common.constant.return_code_success) {
                    this.setData({
                        class_info:res.data.data
                    });
                } else {
                    common.show_modal(res.data.msg);

                }
                resolve();
            }.bind(this));
        }.bind(this))
    },

});