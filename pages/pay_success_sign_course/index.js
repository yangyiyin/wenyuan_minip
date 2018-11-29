Page({
    data:{
        id:0
    },
    onLoad(option){

        this.setData({
            id:option.id
        })

    },
    goto_detail(){
        wx.redirectTo({
            url: '/pages/sign_course_detail/index?order_id='+this.data.id
        })
    },
    goto_index(){
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
});