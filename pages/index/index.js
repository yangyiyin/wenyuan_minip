const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
    data:{
        news_list:[
            // {src:'http://pbw56w09g.bkt.clouddn.com/img_loading_bg2.png','info':'速度快发货的时刻发挥第三方客户1'},
            // {src:'http://pbw56w09g.bkt.clouddn.com/img_loading_bg2.png','info':'速度快发货的时刻发挥第三方客户2'},
            // {src:'http://pbw56w09g.bkt.clouddn.com/img_loading_bg2.png','info':'速度快发货的时刻发挥第三方客户3'},
            // {src:'http://pbw56w09g.bkt.clouddn.com/img_loading_bg2.png','info':'速度快发货的时刻发挥第三方客户4'},
            // {src:'http://pbw56w09g.bkt.clouddn.com/img_loading_bg2.png','info':'速度快发货的时刻发挥第三方客户5'},

        ],
        news_text_list:[


        ],
        news_has_more:false,
        swiper_info:'',
        student_list:null
    },
    onLoad(){
        this.get_news_list(true).then(function(){
            this.data.list.news_list.list[0].active = true;

            this.setData({
                news_list:this.data.list.news_list.list.slice(0,5),
                news_text_list:this.data.list.news_list.list.slice(5,8),
                swiper_info:this.data.list.news_list.list[0].title,
            })
        }.bind(this));
        //this.data.news_list[0].active = true;
        var student_list = [
            {
                school:'观海卫校区',
                lession:'18暑初一数学培优2班',
                classroom:'礼诚306号教师',
                teacher:'林丹丹老师',
                start:'2018.07.05开课',
                guilv:'二四六08:30~10:30',
                address:'慈溪市开发大道658号农业银行4楼',
            },
            {
                school:'观海卫校区',
                lession:'18暑初一数学培优2班',
                classroom:'礼诚306号教师',
                teacher:'林丹丹老师',
                start:'2018.07.05开课',
                guilv:'二四六08:30~10:30',
                address:'慈溪市开发大道658号农业银行4楼',
            }
        ];
         //var student_list = null;
        this.setData({
            student_list:student_list
        })

    },
    get_news_list(init){
      return common.getlist('news_list', {status:1}, 8, this, init);
    },
    swiper_change(e){
        this.data.news_list.forEach(function (ele) {
            ele.active = false;
        })
        this.data.news_list[e.detail.current].active = true;
        this.setData({
            news_list:this.data.news_list,
            swiper_info:this.data.news_list[e.detail.current].title,
        })
    },
    goto_news(){
        wx.navigateTo({
            url: '/pages/news/index'
        })
    },
    goto_change_student(){
        wx.navigateTo({
            url: '/pages/change_student/index'
        })
    },
    goto_news_detail(event){
        if (event.currentTarget.dataset.link) {
            var link = event.currentTarget.dataset.link;
        } else {
            var link = config.base_url_h5+'/apps/wenyuanjiaoyu/h5/news_info.php?id='+event.currentTarget.dataset.id;
        }

        wx.navigateTo({
            url: '/pages/webview/index?link='+encodeURIComponent(link)
        })
    }
    
});