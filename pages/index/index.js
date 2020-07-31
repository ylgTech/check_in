//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');

Page({
  data: {
    username: '',
    checkSuccess: false,
  },

  onLoad: function () {
    let that = this
    let username = wx.getStorageSync('username')
    let ymd = util.formatTime_ymd(new Date());
    console.log(username)
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

  updateDays: function (e) {
    const board = this.selectComponent('.board');
    board.updateDays(e.detail.days)
  },

  info: function () {
    //读取users表数据
    let that = this
    wx.showLoading({
      title: '获取数据中~',
    })
    wx.cloud.callFunction({
      name: "getUsers",
      success(res) {
        console.log("读取成功", res.result.data)
        that.savaExcel(res.result.data)
      },
      fail(res) {
        console.log("读取失败", res)
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

  //把数据保存到excel里，并把excel保存到云存储
  savaExcel(userdata) {
    let that = this
    wx.showLoading({
      title: '生成Excel中~',
    })
    wx.cloud.callFunction({
      name: "excel",
      data: {
        userdata: userdata
      },
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