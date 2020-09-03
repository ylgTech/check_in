//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');

Page({
  data: {
    username: '',
    windowHeight: 0,
    statusBarHeight: 0,
    titleBarHeight: 0,
    mapHeight: 0,
    checkSuccess: false,
  },

  onLoad: function () {
    let that = this
    let username = wx.getStorageSync('username')
    let ymd = util.formatTime_ymd(new Date());
    console.log(username)
    that.getWindowHeight();
    if (username) {
      app.globalData.username = username
      that.setData({
        username: username,
        CustomBar: getApp().globalData.CustomBar
      })
    }
    let checkInfo = wx.getStorageSync('lastCheckDate')
    console.log(checkInfo)
    if (checkInfo == ymd) {
      that.setData({
        checkSuccess: true
      })
    } else {
      const db = wx.cloud.database()
      db.collection('clock_data').where({
        number: username,
        ymd: ymd,
      }).get({
        success: res => {
          if (res.data.length != 0) {
            that.setData({
              checkSuccess: true
            })
          }
        }
      })
    }
  },

  loginSuccess: function (e) {
    this.setData({
      username: e.detail.username
    })
  },

  checkSuccess: function () {
    this.setData({
      checkSuccess: true
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
          mapHeight: contentHeight - 32,  // menuBar: 32px
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  updateDays: function (e) {
    const board = this.selectComponent('.board');
    board.updateDays(e.detail.days)
  },

  //把数据保存到excel里，并把excel保存到云存储
  info: function () {
    let that = this
    wx.showLoading({
      title: '生成Excel中~',
    })
    wx.cloud.callFunction({
      name: "excel",
      success(res) {
        console.log("保存成功", res)
        that.downloadFile(res.result.fileID)
      },
      fail(res) {
        console.log("保存失败", res)
        wx.hideLoading({
          complete: (res) => {},
        })
        wx.showToast({
          title: '请检查网络~',
          icon: 'none'
        })
      },
    })
  },

  downloadFile(fileID) {
    wx.showLoading({
      title: '下载文档中~',
    })
    if (fileID == undefined) {
      console.log('error!')
      wx.showToast({
        title: '还在开发，敬请期待！',
        icon: 'none'
      })
      return
    }
    wx.cloud.downloadFile({
      fileID: fileID,
      success: res => {
        // get temp file path
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          showMenu: true,
          success: function (res) {
            wx.hideLoading({
              complete: (res) => {},
            })
          },
          fail: err => {
            wx.hideLoading({
              complete: (res) => {},
            })
            wx.showToast({
              title: '请检查网络~',
              icon: 'none'
            })
          }
        })
      },
      fail: err => {
        wx.hideLoading({
          complete: (res) => {},
        })
        wx.showToast({
          title: '请检查网络~',
          icon: 'none'
        })
      }
    })
  },
})