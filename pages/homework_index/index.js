const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
    data:{
        homework_class_list:[],
        list_pull_info:'',
        share_img:'',
        show_share_img:false
    },

    onLoad(){
        this.get_homework_class_list(true).then(function(){
            this.setData({
                homework_class_list:this.data.list.homework_class_list.list,
                list_pull_info:this.data.list.homework_class_list.has_more ? '上拉加载更多' : '没有更多了'
            });
        }.bind(this)).catch(function(){})
    },

    get_homework_class_list(init){
        return common.getlist('homework_class_list', {status:1}, 20, this, init);
    },
    // onPullDownRefresh(){
    //     this.get_homework_class_list(true).then(function(){
    //         wx.stopPullDownRefresh()
    //         this.setData({
    //             homework_class_list:this.data.list.homework_class_list.list,
    //             list_pull_info:this.data.list.homework_class_list.has_more ? '上拉加载更多' : '没有更多了'
    //         });
    //     }.bind(this)).catch(function(){})
    // },
    // onReachBottom(){
    //     this.get_homework_class_list().then(function(){
    //         this.setData({
    //             homework_class_list:this.data.list.homework_class_list.list,
    //             list_pull_info:this.data.list.homework_class_list.has_more ? '上拉加载更多' : '没有更多了'
    //         });
    //     }.bind(this)).catch(function(){})
    // },
    goto_news_detail(event){
        // if (event.currentTarget.dataset.link) {
        //     var link = event.currentTarget.dataset.link;
        // } else {
        //     var link = config.base_url_h5+'/apps/wenyuanjiaoyu/h5/news_info.php?id='+event.currentTarget.dataset.id;
        // }
        //
        // wx.navigateTo({
        //     url: '/pages/webview/index?link='+encodeURIComponent(link)
        // })
    },
    goto_homework_list(event){

        var classid = event.currentTarget.dataset.classid;
        var classname = event.currentTarget.dataset.classname;
        wx.navigateTo({
            url: '/pages/homework_list/index?classid='+classid + '&classname='+classname
        });
    },
    showshow(event){
        var id = event.currentTarget.dataset.id;
        wx.showLoading({
            title: '生成图片中...',
        })
        common.request('post','gen_homework_result_share',{id:id},function (res) {
            wx.hideLoading();
            if (res.data.code == common.constant.return_code_success) {
                this.setData({
                    share_img:res.data.data,
                    show_share_img:true
                })

            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },
    close_share_img(){
        this.setData({
            show_share_img:false
        })
    },
    save_share_img(){
        var _this = this;
        var task = wx.downloadFile({
            url: this.data.share_img,
            filePath:'',
            success(res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    // wx.saveFile({
                    //     tempFilePath: res.tempFilePath,
                    //     success(res2) {
                    //         // console.log(res2);
                    //         //const savedFilePath = res.savedFilePath
                    //         file = res2.savedFilePath;
                    //         wx.setStorageSync(url, {file:file,res:res});
                    //         showfile(res, file);
                    //     }
                    // })

                    wx.saveImageToPhotosAlbum({
                        filePath:res.tempFilePath,
                        success(res) {
                            common.show_toast('保存到相册成功!');
                            _this.setData({
                                show_share_img:false
                            })
                        },
                        fail(){
                            //common.show_modal('保存失败');
                        }
                    })

                }
            },
            fail(e){
                console.log(e);
            }
        });

        // wx.saveImageToPhotosAlbum({
        //     filePath:this.data.share_img,
        //     success(res) {
        //         console.log(res);
        //     },
        //     fail(){
        //         common.show_modal('保存失败');
        //     }
        // })
    }
});