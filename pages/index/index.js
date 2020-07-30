//index.js
//获取应用实例
var util = require('../../utils/util.js');

Page({
  data: {
    username: '',
    checkSuccess: false
  },

  onLoad: function () {
    let that = this
    let username = wx.getStorageSync('username')
    console.log(username)
    if (username) {
      that.setData({
        username: username
      })
    }
    let check = wx.getStorageSync('checkInfo')
    console.log(check)
    let ymd = util.formatTime_ymd(date);
    if (checkInfo == ymd) {
      that.setData({
        checkSuccess: true
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
  }
})