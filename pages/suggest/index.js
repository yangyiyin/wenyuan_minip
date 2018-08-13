const common = require('../../utils/common.js');

Page({
    data:{
        inputcontent:''
    },
    handleInputChange(e) {
        this.setData({
            inputcontent: e.detail.value
        });
    },
    submit(){
        var data = {
            'content':this.data.inputcontent
        }
        if (!data.content) {
            common.show_modal('请输入内容提交');
        }
        common.request('post','suggest_edit',data,function (res) {
            if (res.data.code == common.constant.return_code_success) {
                common.show_toast('恭喜你,提交成功!');

                this.setData({
                    inputcontent:''
                })

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    }
});