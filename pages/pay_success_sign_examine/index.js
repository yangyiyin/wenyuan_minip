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
            url: '/pages/examine_detail/index?id='+this.data.id
        })
    },
    goto_index(){
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
});