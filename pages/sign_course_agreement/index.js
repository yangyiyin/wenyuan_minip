const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({
    data:{
        id:0,
        stage_id:0,
        order_id:0,
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
        disabled_name:false,
        show_agreement:false,
        stage_notice:'',
        show_goto_index:false,
        is_agree:false,
        options_student:[],
        select_options_student:[],
        inputstudent_error:'',
        is_show_only:false
    },
    onLoad(option){

        this.setData({

            stage_id:option.stage_id ? option.stage_id : '',
            id:option.id ? option.id : '',
            is_agree:option.is_agree ? option.is_agree : false,
            is_show_only:option.is_show_only ? option.is_show_only : false,
            select_options_student:option.student_name ? [{name:option.student_name}] : [],

        });

        if (!this.data.stage_id && !this.data.id) {
            common.show_toast('没有找到数据');
            return;
        }

        if (this.data.id) {
            wx.showLoading({
                title: '获取报名须知',
            });
            common.request('post','user_notice_agreement_info',{id:this.data.id},function (res) {
                wx.hideLoading();
                if (res.data.code == common.constant.return_code_success) {
                    this.setData({
                        stage_notice:res.data.data.notice_content,
                        show_agreement:true
                    });

                } else {
                    common.show_modal(res.data.msg);
                }
            }.bind(this));
        } else {
            this.get_bind_students();
            if (!this.data.stage_notice) {
                wx.showLoading({
                    title: '获取报名须知',
                });
                common.request('post','stage_info',{id:this.data.stage_id},function (res) {
                    wx.hideLoading();
                    if (res.data.code == common.constant.return_code_success) {
                        this.setData({
                            stage_notice:res.data.data.notice,
                            show_agreement:true
                        });

                    } else {
                        common.show_modal(res.data.msg);
                    }
                }.bind(this));
            } else {
                this.setData({
                    stage_notice:res.data.data.notice,
                    show_agreement:true
                });
            }

        }
    },
    onShow(){


    },
    agree(event){
        var is_ok = event.currentTarget.dataset.is_ok;
        if (is_ok == 1) {
            if (!this.data.select_options_student[0] || !this.data.select_options_student[0].name) {
                common.show_modal('请输入学生姓名');
                return ;
            }
            var data = {
                student_name:this.data.select_options_student[0].name,
                notice:this.data.stage_notice,
                notice_type:1,
                notice_id:this.data.stage_id
            }
            wx.showLoading({
                title: '网络请求中...',
            });
            common.request('post','user_notice_agreement_edit',data,function (res) {
                wx.hideLoading();
                if (res.data.code == common.constant.return_code_success) {
                    common.show_toast('系统已收到您的同意')
                    this.setData({
                        show_goto_index: true,
                        is_agree: true
                    });
                } else {
                    common.show_modal(res.data.msg);
                }
            }.bind(this));

        } else {
            this.goto_index();
        }
    },
    goto_index(){
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    get_bind_students() {

        common.request('post','get_bind_students',{examine_id:this.data.id},function (res) {
            if (res.data.code == common.constant.return_code_success) {
                this.setData({
                    options_student:res.data.data
                });

                if (res.data.data && res.data.data.length) {
                    this.setData({
                        select_options_student:[res.data.data[0]]
                    });
                }
            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },
    select_student(e){
        console.log(e.detail.select_options);
        this.setData({
            select_options_student:e.detail.select_options
        })
        if (e.detail.select_options) {
            this.setData({
                inputstudent_error:''
            })
        }
    },
    bindinputstudentname(e) {
        this.setData({
            select_options_student: [{name:e.detail.value}]
        });
    },

});