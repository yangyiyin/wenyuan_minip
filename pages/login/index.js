const app = getApp();
const common = require('../../utils/common.js');
const util = require('../../utils/util.js');
Page({
    data:{
        isPoneAvailable:false
    },
    onLoad() {
        //登录
        app.get_userinfo().then(function(has_reg){
            if (has_reg) {
                this.goto_index();
            }
        }.bind(this));

    },
    goto_index() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    bindinputtel:function (e) {
        this.setData({
            inputtel: e.detail.value,
            isPoneAvailable: util.isPoneAvailable(e.detail.value)
        });
        if (e.detail.value) {
            this.setData({
                inputtel_error:''
            })
        }
    },
    bindinputcode:function (e) {
        this.setData({
            inputcode: e.detail.value
        });
        if (e.detail.value) {
            this.setData({
                inputcode_error:''
            })
        }
    },
    send_code(){
        var data = {
            phone:this.data.inputtel
        }
        common.request('post','send_code',data,function (res) {
            if (res.data.code == common.constant.return_code_success) {
            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },
    submit:function(){
        var data = {};
        data.phone = this.data.inputtel;
        data.code = this.data.inputcode;
        if (!data.phone) {
            this.setData({
                inputtel_error:'请输入手机号'
            })
            return;
        }

        if (!data.code) {

            this.setData({
                inputcode_error:'请输入验证码'
            })
            return;
        }

        common.request('post','verify_code',data,function (res) {
            if (res.data.code == common.constant.return_code_success) {
                common.request('post','bind_tel',data,function (res) {
                    if (res.data.code == common.constant.return_code_success) {
                        common.show_toast('恭喜你,登录成功!');
                        this.goto_index();
                    } else {
                        common.show_modal(res.data.msg);
                    }
                }.bind(this));

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },
});