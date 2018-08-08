Page({
    data:{
        link:''
    },

    onLoad: function (option) {
        if (option.link) {


            this.setData({
                link : decodeURIComponent(option.link)
            })
        }

    }
});