//app.js
const common = require('./utils/common.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },
  globalData: {
    userInfo: null,
    user_session:null,
    current_cut_img:''
  },
  get_common_request_data:function () {
    return {
      user_session:this.globalData.user_session
    }
  },
  get_userinfo(){
    return new Promise(function (resolve, reject) {
      common.request('post','userinfo',{}, function (res) {
        common.request_callback(res)
        if (res.data.code == common.constant.return_code_success) {
          this.globalData.userInfo = res.data.data;
          if (this.globalData.userInfo.user_tel) {
            resolve(1)
          } else {
            resolve()
          }

        }
      }.bind(this));
    }.bind(this));
  },
  login() {
    return new Promise(function (resolve, reject) {
      wx.login({
        success: res => {
            try {
              var user_session = wx.getStorageSync('user_session');
              if (user_session) {
                this.globalData.user_session = user_session;
                resolve(1)
              } else {

                common.request('post','login',{code:res.code}, function (res) {
                  common.request_callback(res);
                  if (res.data.code == common.constant.return_code_success) {
                    this.globalData.user_session = res.data.data;
                    wx.setStorageSync('user_session', res.data.data);
                    resolve()
                  }
                }.bind(this))

              }
            } catch (e) {
                // Do something when catch error
            }
        }
      });

    }.bind(this));
  }
})
