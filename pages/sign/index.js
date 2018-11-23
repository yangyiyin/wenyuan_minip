const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const app = getApp()
Page({
    data:{
        top_course_list:[


        ],
        swiper_info:'',
        app:app
    },
    onLoad(){
        this.setData({
            ready:false,
            app:app
        })
        this.get_course_list(true).then(function(){
            this.setData({
                ready:true
            })
            if (this.data.page == 1) {
                this.data.list.course_list.list[0].active = true;

                this.setData({
                    top_course_list:this.data.list.course_list.list.slice(0,3),
                    swiper_info:this.data.list.course_list.list[0].title
                })
            }

        }.bind(this)).catch(function(){});
    },
    onShow(){

    },
    get_course_list(init){
      return common.getlist('course_list', {status:1,online:true}, 4, this, init);
    },
    swiper_change(e){
        this.data.top_course_list.forEach(function (ele) {
            ele.active = false;
        });
        if (!this.data.top_course_list[e.detail.current]) return ;
        this.data.top_course_list[e.detail.current].active = true;
        this.setData({
            top_course_list:this.data.top_course_list,
            swiper_info:this.data.top_course_list[e.detail.current].title,
        })
    },

    goto_detail(event){
        var id = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/course_detail/index?id='+id
        })
    },
    onPullDownRefresh(){
        this.get_course_list(true).then(function(){
            this.setData({
                ready:true
            })
            wx.stopPullDownRefresh()
            this.data.list.course_list.list[0].active = true;
            this.setData({
                top_course_list:this.data.list.course_list.list.slice(0,3),
                swiper_info:this.data.list.course_list.list[0].title,
                list_pull_info:this.data.list.course_list.has_more ? '上拉加载更多' : '没有更多了'
            })

        }.bind(this)).catch(function(){})
    },
    onReachBottom(){
        this.get_course_list().then(function(){
            this.setData({
                list_pull_info:this.data.list.course_list.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){});
    },
    
});