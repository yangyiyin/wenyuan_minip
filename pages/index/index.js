const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const app = getApp()
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
        swiper_info:'',
        // student_list:null,
        student_info:null
    },
    onLoad(){
        this.get_news_list(true).then(function(){
            this.data.list.news_list.list[0].active = true;

            this.setData({
                news_list:this.data.list.news_list.list.slice(0,5),
                news_text_list:this.data.list.news_list.list.slice(5,8),
                swiper_info:this.data.list.news_list.list[0].title
            })
        }.bind(this)).catch(function(){});
        this.setData({
            student_info:wx.getStorageSync('student_info')
        });

    },
    onShow(){
        if (app.globalData.to_refresh.index) {
            this.setData({
                ready:false
            })
            this.get_student_class_info();
            app.globalData.to_refresh.index = false;
        }

    },
    get_student_class_info(){
        common.request('post','get_student_class_info',{},function (res) {
            if (res.data.code == common.constant.return_code_success) {
                if (res.data.data.avatar) {
                    res.data.data.avatar += '&i='+Math.random()
                }
                this.setData({
                    student_info:res.data.data.id ? res.data.data : ''
                });
                setTimeout(function(){
                    this.setData({
                        ready:true
                    })
                }.bind(this), 100)
                wx.setStorageSync('student_info', res.data.data);

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
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