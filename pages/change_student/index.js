Page({
    data:{
        students:[
            {
                avatar:'http://pbw56w09g.bkt.clouddn.com/切图_204.png',
                name:'王小明',
                studentid:'20180007',
                active:true
            },
            {
                avatar:'http://pbw56w09g.bkt.clouddn.com/切图_204.png',
                name:'王小明2',
                studentid:'20150005'
            }
        ],
        add_show:false
    },

    change_student(){
        this.setData({
            add_show:true
        })
    },
    submit() {

    }
    
});