//index.js
//获取应用实例
const app = getApp()


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
  },
})