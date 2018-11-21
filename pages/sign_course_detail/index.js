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
        is_need_upload_avatar:false,
        is_new:false,
        options_sex:[
            {id:1,name:'男'},{id:0,name:'女'}
        ],
        select_options_sex:[],
        birthday:'请选择生日',
        inputremark:'',
        inputclass:'',
    },
    onLoad(option){
        //console.log(option.student);
        this.setData({
            ready:false,
            id:option.id,
            from:option.from ? option.from : '',
            student:app.globalData.sign_course_current_student,
            is_new:app.globalData.sign_course_current_student.student_info ? false : true
        });
        if (this.data.is_new) {//如果是新生，则设置头像显示
            this.setData({
                current_cut_img:this.data.student.avatar ? this.data.student.avatar : ''
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
    bindDateChange(e){
        this.setData({
            birthday:e.detail.value
        })
    },
    select_sex(e){
        this.setData({
            select_options_sex:e.detail.select_options
        })
        if (e.detail.select_options) {
            this.setData({
                inputsex_error:''
            })
        }
    },

    bindinputname(e) {
        this.data.student.name = e.detail.value;
        this.setData({
            student:this.data.student
        });
        if (e.detail.value) {
            this.setData({
                inputname_error:''
            })
        }
    },
    bindinputremark(e) {
        this.setData({
            inputremark: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputremark_error:''
            })
        }
    },
    bindinputschool(e) {
        this.setData({
            inputschool: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputschool_error:''
            })
        }
    },
    bindinputgrade(e) {
        this.setData({
            inputgrade: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputgrade_error:''
            })
        }
    },
    bindinputclass(e) {
        this.setData({
            inputclass: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
               inputclass_error:''
            })
        }
    },
    bindinputphone2(e) {
        this.data.student.mother_tel = e.detail.value;
        this.setData({
            student:this.data.student
        });
        // this.setData({
        //     inputphone2: e.detail.value
        // });
        if (e.detail.value) {
            this.setData({
                inputphone2_error:''
            })
        }
    },
    check_submit_data(){
        //console.log(this.data);
        if (this.data.is_new) {
            //console.log(1);
            var data = {
                is_new:true,
                student:{
                    name:this.data.student.name,
                    sex:this.data.select_options_sex[0] ? this.data.select_options_sex[0].id : -1,
                    birthday:this.data.birthday,
                    tel2:this.data.student.mother_tel,
                    avatar:this.data.student.avatar,
                    school:this.data.inputschool ? this.data.inputschool : this.data.student.school,
                    grade:this.data.inputgrade ? this.data.inputgrade : this.data.student.grade,
                    class:this.data.inputclass,
                    remark:this.data.inputremark,
                },
                class_info:this.data.class_info

            }
            //console.log(data);
            if (!data.student.name || data.student.name == '*新生*') {
                common.show_modal('学生姓名不能为空');
                this.setData({
                    inputname_error:'学生姓名不能为空'
                })
                return false;
            }
            if (data.student.sex!=0 && data.student.sex!=1) {
                common.show_modal('请选择性别');
                this.setData({
                    inputsex_error:'请选择性别'
                })
                return false;
            }
            if (!data.student.birthday || data.student.birthday=='请选择生日') {
                common.show_modal('请选择生日');
                this.setData({
                    inputbirthday_error:'请选择生日'
                })
                return false;
            }
            if (!data.student.tel2 ) {
                common.show_modal('请输入备用电话');
                this.setData({
                    inputphone2_error:'请输入备用电话'
                })
                return false;
            }
            if (!data.student.avatar ) {
                common.show_modal('请上传头像');
                this.setData({
                    inputavatar_error:'请上传头像'
                })
                return false;
            }

        } else {
            var data = {
                is_new:false,
                student:this.data.student,
                class_info:this.data.class_info
            }
        }
        return data;
    },
    buy(){

        //检测学生信息
        var data = this.check_submit_data();
       // console.log(data);
        if (!data){
            return;
        }
        console.log(data);
        return;
        //上传图片
        if (this.data.is_need_upload_avatar) {
            wx.showLoading({
                title: '上传头像中。。。',
            });
            wx.uploadFile({
                url: config.urls.upload+'?bucket=wenyuanjiaoyu',
                filePath: data.student.avatar,
                name: 'img',
                formData:{
                    'user_session':app.globalData.user_session
                },
                success: function(res){
                    wx.hideLoading()
                    res.data = JSON.parse(res.data);
                    data.student.avatar = res.data.data[0];
                    this._submit(data);
                }.bind(this)
            });
        } else {
            this._submit(data);
        }

    },
    _submit(data){
        wx.showLoading({
            title: '提交订单中。。。',
        });
        common.request('post','add_order_sign_course',{data:data},function (res) {
            wx.hideLoading();
            if (res.data.code == common.constant.return_code_success) {

                //创建支付

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },



});