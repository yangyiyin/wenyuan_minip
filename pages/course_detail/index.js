const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({
    data:{
        anchor:'',
        fix_tabs:false,
        current_tab:1,
        show_buy_items:false,
        action:1,
        detail:null,
        id:0,
        active_sku:null,
        student_add_info_visible:false,
        step:1,
        options_student:[],
        select_options_student:[],
        current_cut_img:'',
        is_need_upload_avatar:false,

    },
    onLoad(option){

        this.setData({
            ready:false
        });
        this.setData({
            id:option.id
        });
        this.get_bind_students();
        this.get_goods_detail();
        this.get_goods_comment_list(true);
    },
    onShow(){
        if (app.globalData.current_cut_img) {
            this.setData({
                current_cut_img:app.globalData.current_cut_img
            });
            this.setData({
                inputupload_error:''
            });
        }
        if (app.globalData.current_cut_img && this.data.current_cut_img && this.data.step == 2 ) {
            this.data.current_student.avatar = this.data.current_cut_img;
            this.setData({
                current_student: this.data.current_student,
                is_need_upload_avatar: true
            });
            app.globalData.current_cut_img = '';
        }

    },
    init(){

        this.setData({
            current_cut_img:'',
            step:1
        })
        app.globalData.current_cut_img='';
    },

    get_bind_students() {
        common.request('post','get_bind_students',{},function (res) {
            if (res.data.code == common.constant.return_code_success) {
                res.data.data.push({id:-1,name:'新生报名'});
                this.setData({
                    options_student:res.data.data
                });

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },

    get_goods_detail(){
        common.request('post','get_goods_detail',{id:this.data.id},function (res) {
            this.setData({
                ready:true
            })
            if (res.data.code == common.constant.return_code_success) {
                this.setData({
                    detail:res.data.data
                });
            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },

    get_goods_comment_list(init){
        return common.getlist('goods_comment_list', {status:1,goods_id:this.data.id}, 10, this, init);
    },
    goto_info(){

        this.setData({
            current_tab:1,
            anchor:'info'
        })
    },
    goto_teacher(){

      this.setData({
          current_tab:2,
          anchor:'teacher'
      })
    },
    goto_comment(){
        this.setData({
            current_tab:3,
            anchor:'comment'
        })
    },
    bindscroll(e){
        //console.log(e)
        if (e.detail.scrollTop >= 360) {
            this.setData({
                fix_tabs:true
            })
        } else {
            this.setData({
                fix_tabs:false
            })
        }
    },
    buy(){
        this.setData({
            action:2,
            show_buy_items:true
        });
    },
    close_buy(){
        this.setData({
            action:1
        });
    },
    show_add_info(){
        var active_option = this.data.active_sku;
        if (!active_option || !active_option.id) {
            common.show_modal('请选择以上相关类型进行购买');
            return ;
        }
        this.init();
        this.setData({
            student_add_info_visible:true
        })
    },

    check_submit_data(){
        var data = {
            content:{
                name:this.data.inputname,
                school:this.data.inputschool,
                grade:this.data.inputgrade,
                father_tel:this.data.inputphone1,
                mother_tel:this.data.inputphone2,
                avatar:'',
                remark:this.data.inputremark
            }
        }


        if (this.data.step == 2) {
            data.content.name = this.data.current_student.name;
            data.content.avatar = this.data.current_student.avatar;
            data.content.studentid = this.data.current_student.studentid;
        } else if (this.data.step == 3) {
            this.setData({
                is_need_upload_avatar:true
            })
            data.content.avatar = this.data.current_cut_img;
        }

        //检测
        if (!data.content.name) {
            common.show_modal('学生姓名不能为空');
            this.setData({
                inputname_error:'学生姓名不能为空'
            })
            return false;
        }
        if (!data.content.school && !data.content.studentid) {
            common.show_modal('学生所属学校不能为空');
            this.setData({
                inputschool_error:'学生所属学校不能为空'
            })
            return false;
        }
        if (!data.content.grade && !data.content.studentid) {
            common.show_modal('学生年级不能为空');
            this.setData({
                inputgrade_error:'学生年级不能为空'
            })
            return false;
        }

        if (!data.content.father_tel && !data.content.studentid) {
            common.show_modal('主要手机号不能为空');
            this.setData({
                inputphone1_error:'主要手机号不能为空'
            })
            return false;
        }
        if (!data.content.mother_tel && !data.content.studentid) {
            common.show_modal('备用手机号不能为空');
            this.setData({
                inputphone2_error:'备用手机号不能为空'
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

    order(){

        var active_option = this.data.active_sku;
        if (!active_option || !active_option.id) {
            common.show_modal('请选择以上相关类型进行购买');
            return ;
        }
        //检测学生信息
        var data = this.check_submit_data();
        if (!data){
            return;
        }
        //上传图片
        if (this.data.is_need_upload_avatar) {
            wx.showLoading({
                title: '上传头像中。。。',
            });
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
                    this._submit(data.content,active_option);
                }.bind(this)
            });
        } else {
            this._submit(data.content, active_option);
        }

    },
    _submit(data, active_option){
        wx.showLoading({
            title: '提交订单中。。。',
        });
        common.request('post','add_order',{goods_id:this.data.detail.id, option:active_option, extra_data:data},function (res) {
            wx.hideLoading();
            if (res.data.code == common.constant.return_code_success) {
                this.setData({
                    action:1,
                    show_buy_items:false,
                    student_add_info_visible:false

                })
                wx.navigateTo({
                    url: '/pages/order_detail/index?msg=下单成功,请及时支付哦&id='+res.data.data
                })
            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },
    choose_option(event){

        var index = event.currentTarget.dataset.index;
        var index2 = event.currentTarget.dataset.index2;
        this.data.detail.content.checked_options[index].children.forEach(function(val){
            val.active = false;

        });

        this.data.detail.content.checked_options[index].children[index2].active = true;

        // this.setData({
        //     detail:this.data.detail
        // });
        var attr_str = this.get_attr();
        //检测剩余项目是否可选
        this.set_disable_options(attr_str);

        //设置当前的选中sku
        this.set_current_sku(attr_str);
    },
    /**
     * 获取已选的属性字符串
     * @returns {string}
     */
    get_attr(){
        var attr = [];
        var indexx = '';
        this.data.detail.content.checked_options.forEach(function(val1,i1){
            if (val1.children) {
                var is_add = false;
                val1.children.forEach(function(val2, i2){
                    if (val2.active) {
                        if (val2.id) {
                            if (attr.length) {
                                var is_insert = false;
                                try{
                                    attr.forEach(function (id,i3) {
                                        if (parseInt(val2.id) < parseInt(id)) {
                                            //console.log(val2)
                                            attr.splice(i3,0,val2.id);
                                            is_insert = true;

                                            throw new Error("StopIteration");
                                        }
                                    });
                                } catch (e) {
                                    //console.log(e);
                                }

                                if (!is_insert) {
                                    attr.push(val2.id);
                                }
                            } else {
                                attr.push(val2.id);
                            }

                        } else if (val2.index){
                            indexx = 'x'+val2.index;
                        } else {
                            attr.push('');
                        }
                        is_add = true;
                        return;
                    }
                });
                if (!is_add) {
                    attr.push('');
                }
            } else {
                attr.push('');
            }
        });
        //console.log(attr);
        var attr_str = attr.join('-');
        //console.log(attr_str);
        if (indexx) {
            attr_str = (attr_str || attr.length) ? (attr_str+'-'+indexx) : indexx;
        }
       // console.log(attr_str);
        return attr_str;
    },
    set_disable_options(attr_str){
        var attr_origin = attr_str.split('-');
        this.data.detail.content.checked_options.forEach(function(val1,i1){
            if (val1.children) {
                val1.children.forEach(function(val2, i2){
                    var attr = util.deepCopy(attr_origin);
                    if (val2.id || val2.index) {
                        attr[i1] = val2.id ? val2.id : 'x'+val2.index;
                        var sku = this.get_current_sku(attr.join('-'));
                        if (sku) {
                            val2.disable = sku.disable;
                        } else {
                            val2.disable = false;
                        }
                    } else {
                        val2.disable = true;
                    }


                }.bind(this));
            }
        }.bind(this));

        this.setData({
            detail:this.data.detail
        });

    },
    get_current_sku(attr_str){
        var sku = null;
        this.data.detail.content.all_options.forEach(function(val1,i1){
            if (attr_str == val1.attr_id) {
                sku = val1;
            }
        });
        // console.log(sku);
        return sku;
    },
    set_current_sku(attr_str){
        var sku = this.get_current_sku(attr_str);
        // console.log(sku);
        this.setData({
            active_sku:sku
        })
    },
    scrolltolower(){
        this.get_goods_comment_list();
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
    
});