//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const db = wx.cloud.database()

var qqmapsdk = new QQMapWX({

  key: 'ZVDBZ-VBUHQ-CRJ55-GRU7W-FDACJ-B4BMW'

});
Page({
  data: {
    Ofi: null,
    ymd: '',
    hm: '',
    bigImg: '',
    username: '',
    windowHeight: 0,
    statusBarHeight: 0,
    titleBarHeight: 0,
    windowWidth: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onLoad: function (options) {
    this.setData({
      username: options.username,
      Ofi: options.Ofi,
    })
    this.getWindowHeight();
    this.getTime();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    console.log('load'+this.data.Ofi)
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 获取页面的高度
   */
  getWindowHeight: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        var statusBarHeight = res.statusBarHeight;
        var titleBarHeight;
        // 确定titleBar高度（区分安卓和苹果
        if (wx.getSystemInfoSync().system.indexOf('iOS') > -1) {
          titleBarHeight = 44
        } else {
          titleBarHeight = 48
        }
        var contentHeight = res.windowHeight - statusBarHeight - titleBarHeight
        console.log('windowHeight: ' + res.windowHeight)
        that.setData({
          windowHeight: res.windowHeight,
          statusBarHeight: statusBarHeight,
          titleBarHeight: titleBarHeight,
          windowWidth: res.windowWidth,
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  mess_change: function (e) {
    console.log(e.detail.value)
    this.setData({
      username: e.detail.value
    })
  },
  mess_change2: function (e) {
    console.log(e.detail.value)
    this.setData({
      password: e.detail.value
    })
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  upLoadPicture() {
    let that = this;
    that.formSubmit();
    let openid = app.globalData.openid || wx.getStorageSync('openid');
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFilePaths[0];
        const name = Math.random() * 1000000;
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath, //云存储图片名字
          filePath, //临时路径
          success: res => {
            console.log('[上传图片] 成功：', res)
            that.setData({
              bigImg: res.fileID, //云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
            });
            let fileID = res.fileID;
            //把图片存到users集合表
            const db = wx.cloud.database();
            db.collection("clock_data").add({
              data: {
                number: that.data.username,
                ymd: that.data.ymd,
                hm: that.data.hm,
                img: fileID,
                location: that.data.location,
              },
              success: function () {
                wx.showToast({
                  title: '图片存储成功',
                  'icon': 'none',
                  duration: 3000
                })
                wx.navigateTo({
                  url: '../show/show?Ofi=' + that.data.Ofi + '&username=' + that.data.username,
                })
              },
              fail: function () {
                wx.showToast({
                  title: '图片存储失败',
                  'icon': 'none',
                  duration: 3000
                })
              }
            });
          },
          fail: e => {
            console.error('[上传图片] 失败：', e)
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      }
    })
  },
  getTime: function () {
    var that = this
    var ymd = util.formatTime_ymd(new Date());
    var hour = util.formatDate_hour(new Date());
    var minute = util.formatDate_minute(new Date());
    if (hour[0] < 10) {
      hour = hour % 10
    }
    var hm = hour + ':' + minute
    that.setData({
      ymd: ymd,
      hm: hm,
    })
  },
  formSubmit(e) {
    var _this = this;
    qqmapsdk.reverseGeocoder({
      location: '',
      success: function (res) {
        console.log(res);
        _this.setData({
          location: res.result.formatted_addresses.recommend
        })
      },
      fail: function (error) {
        console.error(error)
      }
    })
  },
})