//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    username: '',
  },

  onLoad: function () {
    
  },

  loginSuccess: function (e) {
    this.setData({
      username: e.detail.username
    })
  }
})