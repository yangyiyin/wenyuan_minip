const app = getApp();
const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
    data:{
        id:0,
        info:{
            // title:'五年级内部晋级考试',
            // time:'2018/08/16 08:30',
            // sign_over_time:'2018/08/11 08:30',
            // desc:"    圣诞节福利交水电费离开家圣诞快乐附近多少\n了看风景的克里斯积分克里斯多夫几点开始立即",
            // signs:[
            //    {name:'王小明',result:[{key:'考场',value:'文远恤衫校区 25号教室'},{key:'考号',value:'20180806'}]},
            //    {name:'王小明2',result:[{key:'考场2',value:'文远恤衫校区 25号教室2'},{key:'考号2',value:'20180806'}, {key:'总评',value:'晋级B版'},{key:'总评',value:'晋级B版'},{key:'总评',value:'晋级B版'},{key:'总评',value:'晋级B版'},{key:'总评',value:'晋级B版'}]}
            // ],
            // pay_sum:0,
            // type:1,
            // has_sign:false,
            // is_over:false,
            // cat:1
        },
        current_cut_img:'',
        visible:false,
        options_grade:[
            //{id:1,name:'一年级'},{id:2,name:'二年级'},{id:3,name:'三年级'}
        ],
        options_lession:[
           // {id:1,name:'数学'},{id:2,name:'英语唐'},{id:3,name:'语文'}
        ],
        options_address:[
           // {id:1,name:'观察'},{id:2,name:'浒山'}
        ],
        options_student:[
            //{id:1,name:'杨益银'},{id:2,name:'杨益银2'},{id:-1,name:'新增学生'}
        ],
        select_options_grade:[],
        select_options_lession:[],
        select_options_address:[],
        select_options_student:[],
        current_student:{},
        step:1
    },
    onLoad(option){
        this.setData({
            id:option.id
        })

        this.get_examination_detail();
    },
    onShow: function() {

        if (app.globalData.current_cut_img) {
            this.setData({
                current_cut_img:app.globalData.current_cut_img
            });
            this.setData({
                inputupload_error:''
            });
        }

        if (app.globalData.current_cut_img && this.data.current_cut_img && (this.data.info.type == 3 || (this.data.info.type == 2 && this.data.step == 2))) {
            wx.showModal({
                title: '提示',
                content: '该照片是否用于头像?',
                success: function(res) {
                    if (res.confirm) {
                        this.change_avatar();
                    } else if (res.cancel) {

                    }
                }.bind(this)
            });
            app.globalData.current_cut_img = '';
        }
    },
    init(){
        this.data.options_lession.forEach(function(e){
            e.selected = false;
        })
        this.setData({
            current_cut_img:'',
            inputname:'',
            inputemail:'',
            inputschool:'',
            inputschool_before:'',
            inputprise_before:'',
            select_options_grade:[],
            select_options_lession:[],
            select_options_address:[],
            select_options_student:[],
            inputphone1:'',
            inputphone2:'',
            options_lession:this.data.options_lession,
            step:1
        })
        app.globalData.current_cut_img='';
        if (this.data.info.type == 3) {
            this.setData({
                current_cut_img: this.data.current_student.avatar
            })
        }
    },

    get_examination_detail(){
        var id = this.data.id;
        common.request('post','get_examination_detail',{id:id},function (res) {
            if (res.data.code == common.constant.return_code_success) {
                this.setData({
                    info:res.data.data.info,
                    current_student:res.data.data.current_student,
                    options_grade:res.data.data.options.options_grade,
                    options_lession:res.data.data.options.options_lession,
                    options_address:res.data.data.options.options_address,
                    options_student:res.data.data.options.options_student,
                });
                this.get_bind_students();
            } else {
                common.show_modal(res.data.msg);
            }
            setTimeout(function(){
                this.setData({
                    ready:true
                })
            }.bind(this), 150)
        }.bind(this));
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
        if (e.detail.select_options) {
            this.setData({
                inputgrade_error:''
            })
        }
    },
    select_lession(e){
        this.setData({
            select_options_lession:e.detail.select_options
        })
        if (e.detail.select_options) {
            this.setData({
                inputlession_error:''
            })
        }
    },
    select_address(e){
        this.setData({
            select_options_address:e.detail.select_options
        })
        if (e.detail.select_options) {
            this.setData({
                inputaddress_error:''
            })
        }
    },
    select_student(e){
        this.setData({
            select_options_student:e.detail.select_options
        })
        if (e.detail.select_options) {
            this.setData({
                inputstudent_error:''
            })
        }
    },

    bindinputname(e) {
        this.setData({
            inputname: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputname_error:''
            })
        }
    },
    bindinputemail(e) {
        this.setData({
            inputemail: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputemail_error:''
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
    bindinputschool_before(e) {
        this.setData({
            inputschool_before: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputschool_before_error:''
            })
        }
    },
    bindinputprise_before(e) {
        this.setData({
            prise_before: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                prise_before_error:''
            })
        }
    },
    bindinputphone1(e) {
        this.setData({
            inputphone1: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputphone1_error:''
            })
        }
    },
    bindinputphone2(e) {
        this.setData({
            inputphone2: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputphone2_error:''
            })
        }
    },
    next_step(){
        if (!this.data.select_options_student.length) {
            common.show_toast('请选择学生');
            return;
        }
        if (this.data.select_options_student[0].id == -1) {
            this.setData({
                step:3
            })
        } else {
            this.setData({
                step:2,
                current_student:this.data.select_options_student[0],
                current_cut_img:this.data.select_options_student[0].avatar
            });
        }
    },
    change_avatar(){
        if (!this.data.current_cut_img || !this.data.current_student.studentid) {
            return;
        }
        //上传
        wx.uploadFile({
            url: config.urls.change_avatar,
            filePath: this.data.current_cut_img,
            name: 'img',
            formData:{
                'user_session':app.globalData.user_session,
                'studentid' : this.data.current_student.studentid
            },
            success: function(res){
                res.data = JSON.parse(res.data);
                var avatar = res.data.data;

                app.globalData.current_cut_img = '';
                this.data.current_student.avatar = avatar;
                this.setData({
                    current_student:this.data.current_student
                });
                this.get_bind_students();

                app.globalData.to_refresh.index = true;
                app.globalData.to_refresh.timetable = true;
                app.globalData.to_refresh.mine = true;
            }.bind(this)
        });
    },

    check_submit_data(){
        var data = {
            from:1,
            is_new:0,
            out_id:this.data.id,
            student_name:'',
            email:this.data.inputemail,
            studentid:'',
            content:{
                name:'',
                school:this.data.inputschool,
                school_before:this.data.inputschool_before,
                prise_before:this.data.inputprise_before,
                grade:'',
                lession:'',
                address:'',
                father_tel:this.data.inputphone1,
                mother_tel:this.data.inputphone2,
                avatar:''
            }
        }

        if (this.data.select_options_grade[0]) {
            data.content.grade = this.data.select_options_grade[0].name
        }
        if (this.data.select_options_lession[0]) {
            this.data.select_options_lession.forEach(function(e){
                data.content.lession += e.name+';';
            })
        }
        if (this.data.select_options_address[0]) {
            data.content.address = this.data.select_options_address[0].name
        }
        if (this.data.info.type == 1) {
            data.is_new = 1;
            data.student_name = this.data.inputname;
            data.content.avatar = this.data.current_cut_img;
            data.studentid = '';
        } else if (this.data.info.type == 2) {
            if (this.data.step == 2) {
                data.is_new = 0;
                data.student_name = this.data.current_student.name;
                data.content.avatar = this.data.current_student.avatar;
                data.studentid = this.data.current_student.studentid;
            } else if (this.data.step == 3) {
                data.is_new = 1;
                data.student_name = this.data.inputname;
                data.content.avatar = this.data.current_cut_img;
                data.studentid = '';
            }
        } else if (this.data.info.type == 3) {
            data.is_new = 0;
            data.student_name = this.data.current_student.name;
            data.content.avatar = this.data.current_student.avatar;
            data.studentid = this.data.current_student.studentid;
        }
        data.content.name = data.student_name;
        //检测
        if (!data.content.name) {
            common.show_modal('学生姓名不能为空');
            this.setData({
                inputname_error:'学生姓名不能为空'
            })
            return false;
        }
        if (!data.content.school && data.is_new) {
            common.show_modal('学生所属学校不能为空');
            this.setData({
                inputschool_error:'学生所属学校不能为空'
            })
            return false;
        }
        if (!data.content.grade && data.is_new) {
            common.show_modal('学生下学期年级不能为空');
            this.setData({
                inputgrade_error:'学生下学期年级不能为空'
            })
            return false;
        }
        if (!data.content.lession && this.data.info.type == 1 && data.is_new) {
            common.show_modal('学生所需培训课程不能为空');
            this.setData({
                inputlession_error:'学生所需培训课程不能为空'
            })
            return false;
        }
        if (!data.content.address && data.is_new) {
            common.show_modal('培训地点不能为空');
            this.setData({
                inputaddress_error:'培训地点不能为空'
            })
            return false;
        }
        if (!data.content.father_tel && data.is_new) {
            common.show_modal('父亲手机号不能为空');
            this.setData({
                inputphone1_error:'父亲手机号不能为空'
            })
            return false;
        }
        if (!data.content.mother_tel && data.is_new) {
            common.show_modal('母亲手机号不能为空');
            this.setData({
                inputphone2_error:'母亲手机号不能为空'
            })
            return false;
        }
        if (!data.content.avatar) {
            common.show_modal('学员照片不能为空,请上传');
            this.setData({
                inputupload_error:'学员照片不能为空,请上传'
            })
            return false;
        }
        return data;
    },
    /**
     * 报名考试
     */
    submit(e, pay_no, _this){
        var data = this.check_submit_data();
        if (!data) {
            return;
        }
        if (pay_no) {
            data.pay_no = pay_no;
        }
        if (data.is_new) {
            wx.showLoading({
                title: '上传照片中。。。',
            })
            wx.uploadFile({
                url: config.urls.upload+'?bucket=wenyuanjiaoyu',
                filePath: data.content.avatar,
                name: 'img',
                formData:{
                    'user_session':app.globalData.user_session
                },
                success: function(res){
                    wx.hideLoading()
                    res.data = JSON.parse(res.data);
                    data.content.avatar = res.data.data[0];
                    this._submit(data, _this);
                }.bind(this)
            });
        } else {
            this._submit(data, _this);
        }

    },
    to_pay(){
        var _data = this.check_submit_data();
        if (!_data) {
            return;
        }

        var data = {
            id:this.data.id,
            student_name: _data.student_name
        };
        common.request('post','pay_create',data,function (res) {
            if (res.data.code == common.constant.return_code_success) {
                //调起支付
                var _this = this;
                wx.requestPayment({
                    'timeStamp': String(res.data.data.timeStamp),
                    'nonceStr': res.data.data.nonceStr,
                    'package': res.data.data.package,
                    'signType':res.data.data.signType,
                    'paySign': res.data.data.sign,
                    'success':function(ret){
                        _this.submit(null, res.data.data.pay_no, _this);
                    },
                    'fail':function(ret){
                    }
                })

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));

    },
    _submit(data,_this){

        if (data.pay_no) {
            var time = 20;
            wx.showLoading({
                title: '支付中。。。',
            })
            //轮询回调支付状态,创建订单
            var int_ins = setInterval(function(){
                if (time <= 0) {
                    wx.hideLoading()
                    clearInterval(int_ins);
                    common.show_modal('系统异常,支付失败,请联系官方客服~');
                    return ;
                }

                common.request('post','examination_sign',data,function (res) {
                    if (res.data.code == common.constant.return_code_success) {
                        wx.hideLoading();
                        clearInterval(int_ins);
                        common.show_toast('恭喜你,报名成功!');
                        _this.get_examination_detail();
                        _this.setData({
                            visible:false
                        })

                    } else {
                        //common.show_modal(res.data.msg);
                    }
                });

                time --;
            }, 500);
        } else {
            common.request('post','examination_sign',data,function (res) {
                if (res.data.code == common.constant.return_code_success) {
                    common.show_toast('恭喜你,报名成功!');
                    this.get_examination_detail();
                    this.setData({
                        visible:false
                    })

                } else {
                    common.show_modal(res.data.msg);
                }
            }.bind(this));

        }


    },
    get_bind_students() {
        common.request('post','get_bind_students',{},function (res) {
            if (res.data.code == common.constant.return_code_success) {
                if(this.data.info.type != 3) {
                    res.data.data.push({id:-1,name:'新增学生'});
                }

                this.setData({
                    options_student:res.data.data
                });

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },
    show_ticket(event){
        var ticket = event.currentTarget.dataset.ticket;
        if (ticket) {
            wx.previewImage({
                urls: [ticket] // 需要预览的图片http链接列表
            });
        } else {
            common.show_modal('图片不存在,请联系官方客服');
        }

    },
    show_edit_avatar(event){
        this.setData({
            edit_avatar_visible:true,
            current_cut_img:'',
            current_edit_avatar_id :event.currentTarget.dataset.id
        })
    },
    edit_avatar(){
        wx.showLoading({
            title: '上传照片中。。。',
        })
        wx.uploadFile({
            url: config.urls.upload+'?bucket=wenyuanjiaoyu',
            filePath: this.data.current_cut_img,
            name: 'img',
            formData:{
                'user_session':app.globalData.user_session
            },
            success: function(res){
                wx.hideLoading()
                res.data = JSON.parse(res.data);
                var avatar = res.data.data[0];
                var id = this.data.current_edit_avatar_id;

                common.request('post','edit_avatar',{id:id,avatar:avatar},function (res) {
                    if (res.data.code == common.constant.return_code_success) {
                        common.show_toast('更改照片成功');
                        this.setData({
                            edit_avatar_visible:false,
                            current_cut_img:''
                        })
                    } else {
                        common.show_modal(res.data.msg);
                    }
                }.bind(this));


            }.bind(this)
        });
    }

});