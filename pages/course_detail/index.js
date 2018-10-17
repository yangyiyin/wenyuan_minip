const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const app = getApp()
Page({
    data:{
        anchor:'',
        fix_tabs:false,
        current_tab:1,
        show_buy_items:false,
        action:1,
        detail:null,
        id:0
    },
    onLoad(option){

        this.setData({
            ready:false
        });
        this.setData({
            id:option.id
        })
        this.get_goods_detail();
        this.get_goods_comment_list(true);
    },
    onShow(){


    },
    get_goods_detail(){
        common.request('post','get_goods_detail',{id:this.data.id},function (res) {
            this.setData({
                ready:true
            })
            if (res.data.code == common.constant.return_code_success) {
                this.setData({
                    detail:res.data.data
                });
            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },

    get_goods_comment_list(init){
        return common.getlist('goods_comment_list', {status:1}, 10, this, init);
    },
    goto_info(){

        this.setData({
            current_tab:1,
            anchor:'info'
        })
    },
    goto_teacher(){

      this.setData({
          current_tab:2,
          anchor:'teacher'
      })
    },
    goto_comment(){
        this.setData({
            current_tab:3,
            anchor:'comment'
        })
    },
    bindscroll(e){
        //console.log(e)
        if (e.detail.scrollTop >= 360) {
            this.setData({
                fix_tabs:true
            })
        } else {
            this.setData({
                fix_tabs:false
            })
        }
    },
    buy(){
        this.setData({
            action:2,
            show_buy_items:true
        });
    },
    close_buy(){
        this.setData({
            action:1
        });
    },
    order(){
        var active_option = null;
        this.data.detail.content.options.forEach(function(val){
            if(val.active === true) {
                active_option = val;
                return ;
            }
        });
        if (!active_option) {
            common.show_modal('请选择时间');
            return ;
        }

        common.request('post','add_order',{goods_id:this.data.detail.id, option:active_option},function (res) {

            if (res.data.code == common.constant.return_code_success) {
                this.setData({
                    action:1,
                    show_buy_items:false
                })
                wx.navigateTo({
                    url: '/pages/order_detail/index?msg=下单成功,请及时支付哦&id='+res.data.data
                })
            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },
    choose_option(event){
        var index = event.currentTarget.dataset.index;
        this.data.detail.content.options.forEach(function(val){
            val.active = false;
        });
        this.data.detail.content.options[index].active = true;

        this.setData({
            detail:this.data.detail
        })
    },
    scrolltolower(){
        this.get_goods_comment_list();
    }
    
});