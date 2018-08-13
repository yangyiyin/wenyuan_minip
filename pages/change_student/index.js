const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const app = getApp()
Page({
    data:{
        students:[],
        add_show:false,
        visible:false,
        current_cut_img:'',
        current_index:null

    },
    onLoad(){

        this.setData({
            students:app.globalData.bind_students
        });
      this.get_bind_students();
    },
    onShow: function() {
        this.setData({
            current_cut_img:app.globalData.current_cut_img
        });
    },
    change_student(){
        this.setData({
            add_show:true
        })
    },
    bindinputname(e){
        this.setData({
            inputname: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputname_error:''
            })
        }
    },
    submit() {
        var data = {};
        data.name = this.data.inputname;
        if (!data.name) {
            this.setData({
                inputname_error:'请输入姓名'
            })
            return;
        }


        common.request('post','bind_student',data,function (res) {
            if (res.data.code == common.constant.return_code_success) {

                common.show_toast('恭喜你,添加成功!');
                this.get_bind_students();

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },
    get_bind_students() {
        common.request('post','get_bind_students',{},function (res) {
            if (res.data.code == common.constant.return_code_success) {
                this.setData({
                    students:res.data.data
                });
                app.globalData.bind_students = res.data.data;

            } else {
                common.show_modal(res.data.msg);
            }
            setTimeout(function(){
                this.setData({
                    ready:true
                })
            }.bind(this), 50)
        }.bind(this));
    },
    show_change_avatar(event){
        var info = event.currentTarget.dataset.item;
        this.setData({
            info:info,
            current_index:event.currentTarget.dataset.index,
            visible:true
        })
    },
    change_avatar(){
        if (!this.data.current_cut_img) {
            this.setData({
                visible:false
            })
            return;
        }
        //上传
        wx.uploadFile({
            url: config.urls.change_avatar,
            filePath: this.data.current_cut_img,
            name: 'img',
            formData:{
                'user_session':app.globalData.user_session,
                'studentid' : this.data.info.studentid
            },
            success: function(res){
                app.globalData.current_cut_img = '';
                this.data.students[this.data.current_index].avatar = this.data.current_cut_img;
                this.setData({
                    visible:false,
                    students:this.data.students
                });
                app.globalData.to_refresh.index = true;
                app.globalData.to_refresh.timetable = true;
                app.globalData.to_refresh.mine = true;

            }.bind(this)
        });
    },
    change_active_student(event){
        var info = event.currentTarget.dataset.item;
        common.request('post','change_active_student',{student_id:info.id},function (res) {
            if (res.data.code == common.constant.return_code_success) {
                common.show_toast('切换成功!');
                this.get_bind_students();
                app.globalData.to_refresh.index = true;
                app.globalData.to_refresh.timetable = true;
                app.globalData.to_refresh.examine = true;
                app.globalData.to_refresh.mine = true;

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    }

});