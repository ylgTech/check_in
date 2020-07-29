const app = getApp()
var util = require('../../utils/util.js');
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Ofi:null,
    username: '',
    windowHeight: 0,
    statusBarHeight: 0,
    titleBarHeight: 0,
    contentHeight:0,
    windowWidth: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      username: options.username,
      Ofi:options.Ofi,
    })
    this.getWindowHeight();
    this.getTime();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
        var contentHeight = res.windowHeight-statusBarHeight-titleBarHeight
        console.log('windowHeight: ' + res.windowHeight)
        that.setData({
          windowHeight: res.windowHeight,
          statusBarHeight: statusBarHeight,
          titleBarHeight: titleBarHeight,
          windowWidth: res.windowWidth,
          contentHeight:contentHeight,
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  getTime: function () {
    var that = this
    var year = util.formatDate_year(new Date());
    var month = util.formatDate_month(new Date());
    var day = util.formatDate_day(new Date());
    that.setData({
      year: year[0],
      month: month[0],
      day: day[0],
    })
    console.log(year[0])
    console.log(month[0])
    console.log(day[0])
  },
})