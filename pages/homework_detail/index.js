const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
const app = getApp();
Page({
    data:{
        info:{},
        id:'0',
        answer_reply: {},
        active:1,
        upload_imgs:[],
        record_file:'',
        record_file_qiniu:'',
        record_step:0,
        record_currentTime:'0:0',
        RecordAudioContext:null,
        is_playing_record:false

    },

    onLoad(option){
        if (wx.setInnerAudioOption) {
            wx.setInnerAudioOption({
                obeyMuteSwitch:false
            })
        }

        this.setData({
            id:option.id,
        });
        this.get_home_work_detail();
    },

    get_home_work_detail(){
        //reckon_result
        common.request('post','my_home_work_detail',{id:this.data.id},function (res) {

            if (res.data.code == common.constant.return_code_success) {
                //初始化音频

                if (res.data.data.homework_info.homework_downloads_objs && res.data.data.homework_info.homework_downloads_objs.length > 0) {
                    res.data.data.homework_info.homework_downloads_objs.forEach((val,i) => {
                        if (val.InnerAudioContext) {
                            return;
                        }
                        val.InnerAudioContext = wx.createInnerAudioContext();
                        val.InnerAudioContext.src = val.url;
                        val.InnerAudioContext.obeyMuteSwitch = false;
                        // val.InnerAudioContext.onWaiting(() => {
                        //     common.show_toast('加载中...')
                        // })

                        val.InnerAudioContext.onPlay(()=>{

                            this.data.info.homework_info.homework_downloads_objs[i].InnerAudioContext.onTimeUpdate(() => {

                                var left = this.data.info.homework_info.homework_downloads_objs[i].InnerAudioContext.duration - this.data.info.homework_info.homework_downloads_objs[i].InnerAudioContext.currentTime;
                                var min = parseInt(left / 60);
                                var sec = parseInt(left - min * 60);

                                if (!this.data.info.homework_info.homework_downloads_objs[i].is_seeking) {
                                    this.data.info.homework_info.homework_downloads_objs[i].playtime = min + ':' + sec;
                                    //console.log(1);
                                    this.data.info.homework_info.homework_downloads_objs[i].step = parseInt(this.data.info.homework_info.homework_downloads_objs[i].InnerAudioContext.currentTime * 100 / this.data.info.homework_info.homework_downloads_objs[i].InnerAudioContext.duration);

                                    this.setData({
                                        info:this.data.info
                                    });
                                }

                             })
                        });



                    })
                }

                this.setData({
                    info:res.data.data,
                    answer_reply:res.data.data.homework_question_reply
                });
            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },
    onUnload(){
        if (this.data.info.homework_info.homework_downloads_objs && this.data.info.homework_info.homework_downloads_objs.length > 0) {
            this.data.info.homework_info.homework_downloads_objs.forEach(function(val){
                if (val.InnerAudioContext) {
                    val.InnerAudioContext.destroy();
                }
            })
        }
        if (this.data.RecordAudioContext) {
            this.data.RecordAudioContext.destroy();
        }

    },

    playAudio(event){
        common.show_toast('加载中...');
        var index = event.currentTarget.dataset.index;
        this.data.info.homework_info.homework_downloads_objs[index].isPlaying = true;
        this.data.info.homework_info.homework_downloads_objs[index].InnerAudioContext.play();

        this.setData({
            info:this.data.info
        });
    },
    seekAudio(event){
        var index = event.currentTarget.dataset.index;
        var position = parseInt(event.detail.value / 100 * this.data.info.homework_info.homework_downloads_objs[index].InnerAudioContext.duration);

        this.data.info.homework_info.homework_downloads_objs[index].InnerAudioContext.seek(position);
        this.data.info.homework_info.homework_downloads_objs[index].is_seeking = false;
        this.playAudio(event);

    },
    pauseAudio(event){
        var index = event.currentTarget.dataset.index;
        this.data.info.homework_info.homework_downloads_objs[index].isPlaying = false;

        this.data.info.homework_info.homework_downloads_objs[index].InnerAudioContext.pause();
        this.setData({
            info:this.data.info
        });
    },
    seeking(event){
        var index = event.currentTarget.dataset.index;
        this.data.info.homework_info.homework_downloads_objs[index].is_seeking = true;
        //console.log(this.data.info.homework_info.homework_downloads_objs[index].is_seeking);
        this.data.info.homework_info.homework_downloads_objs[index].step = event.detail.value;

        var left = this.data.info.homework_info.homework_downloads_objs[index].InnerAudioContext.duration * (1 - event.detail.value / 100);
        var min = parseInt(left / 60);
        var sec = parseInt(left - min * 60);
        this.data.info.homework_info.homework_downloads_objs[index].playtime = min + ':' + sec;

        this.setData({
            info:this.data.info
        });

    },
    change_active(event){
        this.setData({
            active:event.currentTarget.dataset.active_id
        })
    },
    radioChange(event) {
        var qid = event.currentTarget.dataset.qid;

        this.data.answer_reply[qid] = {
            answer:event.detail.value,
            qid:qid,
        };
        this.setData({
            answer_reply:this.data.answer_reply
        })
    },
    bindinput(event){
        var qid = event.currentTarget.dataset.qid;
        var blank_index = event.currentTarget.dataset.blank_index;
        if (blank_index) {

            this.data.answer_reply[qid] = this.data.answer_reply[qid] ? this.data.answer_reply[qid] : {qid:qid,answer:{}};
            //this.data.answer_reply[qid][blank_index] = event.detail.value;

            this.data.answer_reply[qid].answer[blank_index] = event.detail.value;

        } else {
            this.data.answer_reply[qid] = {
                answer:event.detail.value,
                qid:qid,
            };
        }
        this.setData({
            answer_reply:this.data.answer_reply
        })

    },
    submit(){
       // console.log(this.data.answer_reply);
        //todo 提交自动计算submit_result
        wx.showLoading({
            title: '提交答案中。。。',
        })
        common.request('post','submit_result',{result:this.data.answer_reply,from_type:1, sub_id:this.data.info.homework_class.classid, main_id:this.data.info.homework_class.homework_id, student_id:this.data.info.student.id},function (res) {
            wx.hideLoading();
            if (res.data.code == common.constant.return_code_success) {
                //common.show_toast(res.data.msg);
                this.reckon_result();
               // this.get_home_work_detail();
            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));

    },
    reckon_result(){
        wx.showLoading({
            title: '计算成绩中。。。',
        })
        common.request('post','reckon_result',{classid:this.data.info.homework_class.classid, homework_id:this.data.info.homework_class.homework_id, student_id:this.data.info.student.id},function (res) {
            wx.hideLoading();
            if (res.data.code == common.constant.return_code_success) {
                common.show_modal('计算成功,您可在本页最上方看到计算结果');
                this.get_home_work_detail();
            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));
    },

    upload_record(){
        if (!this.data.upload_imgs.length && !this.data.record_file) {
            common.show_toast('请上传作业文件');
            return;
        }

        if (this.data.record_file) {
            wx.showLoading({
                title: '上传录音中。。。',
            })
            var _this = this;
            wx.uploadFile({
                url: config.urls.upload+'?bucket=wenyuanjiaoyu',
                filePath: this.data.record_file,
                name: 'img',
                formData:{
                    'user_session':app.globalData.user_session
                },
                success: function(res){
                    wx.hideLoading();
                    res.data = JSON.parse(res.data);
                    _this.data.record_file_qiniu = res.data.data[0]
                    _this.setData({
                        record_file_qiniu:res.data.data[0]
                    })
                    _this.submit_imgs();
                }.bind(this)
            });
        }
    },
    submit_imgs(){

        if (!this.data.upload_imgs.length && !this.data.record_file_qiniu) {
            common.show_toast('请上传作业文件');
            return;
        }

        wx.showLoading({
            title: '提交中。。。',
        })
        common.request('post','homework_upload_docs',{id:this.data.id, upload_imgs:this.data.upload_imgs, objs:[this.data.record_file_qiniu],student_id:this.data.info.student.id},function (res) {
            wx.hideLoading();
            if (res.data.code == common.constant.return_code_success) {
                common.show_toast(res.data.msg);
                this.get_home_work_detail();
            } else {
                common.show_modal(res.data.msg);
            }
        }.bind(this));

    },
    download_file(event){
        wx.setClipboardData({
            data: event.currentTarget.dataset.item.url,
            success(res) {
                common.show_modal('复制链接成功,建议发送链接到电脑后打开下载(由于微信限制,无法在小程序内下载文件)');
            }
        })


        var url = event.currentTarget.dataset.item.url;
        var index = event.currentTarget.dataset.index;
        var file = wx.getStorageSync(url);
        if (file) {
            showfile(file.res,file.file);
        } else {
            var filePath = ''
            var task = wx.downloadFile({
                url: url,
                filePath:filePath,
                success(res) {
                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                    if (res.statusCode === 200) {
                        wx.saveFile({
                            tempFilePath: res.tempFilePath,
                            success(res2) {
                                // console.log(res2);
                                //const savedFilePath = res.savedFilePath
                                file = res2.savedFilePath;
                                wx.setStorageSync(url, {file:file,res:res});
                                showfile(res, file);
                            }
                        })

                    }
                },
                fail(e){
                    console.log(e);
                }
            });
            task.onProgressUpdate((res) => {
                if (this.data.info.homework_info.other_downloads[index]) {
                    this.data.info.homework_info.other_downloads[index].download_info = res.progress + '%';
                    this.setData({
                        info:this.data.info
                    })
                }


            });
        }
        function showfile(res, file) {
            var file_arr = file.split('.');
            var ext = file_arr[file_arr.length-1];
            console.log(ext);
            if (ext == 'png' || ext == 'jpg' || ext == 'jpeg') {
                wx.previewImage({
                    current: file,
                    urls: [file]
                })
            } else {
                wx.openDocument({
                    filePath:file,
                    success(res) {
                        console.log('打开文档成功')
                    },
                    fail(e){
                        console.log(e)
                    }
                })
            }
        }
    },
    uploadimg(event){

        var index = event.currentTarget.dataset.index;
        var _this = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {

                //上传图片
                wx.showLoading({
                    title: '上传图片中。。。',
                })
                wx.uploadFile({
                    url: config.urls.upload+'?bucket=wenyuanjiaoyu',
                    filePath: res.tempFilePaths[0],
                    name: 'img',
                    formData:{
                        'user_session':app.globalData.user_session
                    },
                    success: function(res){
                        wx.hideLoading();
                        res.data = JSON.parse(res.data);
                        _this.data.upload_imgs[index] = res.data.data[0]
                        _this.setData({
                            upload_imgs:_this.data.upload_imgs
                        })

                    }.bind(this)
                });

            }
        })



    },
    delimg(event){
        var index = event.currentTarget.dataset.index;

        this.data.upload_imgs.splice(index, 1);
        this.setData({
            upload_imgs:this.data.upload_imgs
        })

    },

    startRecord(){
        if (!this.data.RecorderManager) {
            this.data.RecorderManager = wx.getRecorderManager();
            this.data.RecorderManager.onStop((res) => {
                const {tempFilePath} = res;
                this.setData({
                    record_file:tempFilePath
                });

                if (!this.data.RecordAudioContext) {
                    this.data.RecordAudioContext = wx.createInnerAudioContext();
                    this.data.RecordAudioContext.onPlay(()=>{
                        this.data.RecordAudioContext.onTimeUpdate(() => {

                            var left = this.data.RecordAudioContext.duration - this.data.RecordAudioContext.currentTime;
                            var min = parseInt(left / 60);
                            var sec = parseInt(left - min * 60);

                            if (!this.data.RecordAudioContext.is_seeking) {

                                var record_step = parseInt(this.data.RecordAudioContext.currentTime * 100 / this.data.RecordAudioContext.duration);
                                //console.log(record_step);
                                this.setData({
                                    record_step:record_step
                                });
                            }

                        })
                    });

                }
                this.data.RecordAudioContext.src = this.data.record_file;

            })
        }
        if (!this.interval) {
            var record_currentTime = 0;
            this.interval = setInterval(() => {
                    record_currentTime ++;
                    var min = parseInt(record_currentTime / 60);
                    var sec = record_currentTime - min * 60;
                    this.setData({
                        record_currentTime:min + ':' + sec
                    })
                },1000);
        }
        if (this.data.RecordAudioContext) {
            this.data.RecordAudioContext.stop();
            this.setData({
                record_step:0,
                is_playing_record:false
            })
        }

        this.data.RecorderManager.start({
            format:'mp3'
        });
        this.setData({
            recording:true
        })

    },
    stopRecord(){
        this.setData({
            recording:false
        });

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        if (!this.data.RecorderManager) {
            return;
        }
        this.data.RecorderManager.stop();
    },
    del_record_file()
    {
        this.setData({
            record_file:''
        });
        this.data.RecordAudioContext.destroy();
        this.data.RecordAudioContext = null;
    },
    playAudio_record(){


        this.data.RecordAudioContext.play();

        this.setData({
            is_playing_record: true
        });
    },
    seekAudio_record(event){
        var position = parseInt(event.detail.value / 100 * this.data.RecordAudioContext.duration);

        this.data.RecordAudioContext.seek(position);
        this.data.RecordAudioContext.is_seeking = false;
        this.playAudio_record();

    },
    pauseAudio_record(){
        this.data.RecordAudioContext.pause();

        this.setData({
            is_playing_record: false
        });
    },
    seeking_record(event){

        this.data.RecordAudioContext.is_seeking = true;

    },


});