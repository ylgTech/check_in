const app = getApp()
var util = require('../../utils/util.js');
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Ofi: null,
    a: 0,
    b: 0,
    c: 0,
    username: '',
    windowHeight: 0,
    statusBarHeight: 0,
    titleBarHeight: 0,
    contentHeight: 0,
    windowWidth: 0,
    ymd: '',
    hm: '',
    match_all: [],
    users: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      username: options.username,
      Ofi: options.Ofi,
    })
    this.getWindowHeight();
    this.getTime();
    this.jumpTo();
    db.collection('clock_data').where({
      number: that.data.username,
    }).get({
      success: res => {
        console.log(res)
        if (res.data.length > 99) {
          var a = parseInt(res.data.length / 100)
          var b = parseInt(res.data.length / 10) - a * 10
          var c = res.data.length % 10
          that.setData({
            a: a,
            b: b,
            c: c
          })
        } else if (res.data.length < 100 || res.data.length > 9) {
          var a = 0
          var b = parseInt(res.data.length / 10)
          var c = res.data.length % 10
          that.setData({
            a: a,
            b: b,
            c: c
          })
        } else {
          var a = 0
          var b = 0
          var c = res.data.length
          that.setData({
            a: a,
            b: b,
            c: c
          })
        }
        that.setData({
          match_all: res.data.reverse()
        })
      }
    })
    db.collection('normal_login').get({
      success: res => {
        that.setData({
          users: res.data.reverse()
        })
      }
    })
  },
  match_detail: function (e) {
    var id = e.currentTarget.dataset.id; // 获取点击的推文的数组下标
    var url = this.data.match_all[id]._introduction; // 通过id判断是哪个推文的链接
    //跳转并传参
    wx.navigateTo({
      url: '../../components/show/show?name=match_all&url=' + url,
    })
    console.log('开启')
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
        var contentHeight = res.windowHeight - statusBarHeight - titleBarHeight
        console.log('windowHeight: ' + res.windowHeight)
        that.setData({
          windowHeight: res.windowHeight,
          statusBarHeight: statusBarHeight,
          titleBarHeight: titleBarHeight,
          windowWidth: res.windowWidth,
          contentHeight: contentHeight,
        })
      },
      fail: function (res) {
        console.log(res)
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
  jumpTo: function (e) {
    var that = this
    console.log(that.data.Ofi)
    if (that.data.Ofi == 'false') {
      db.collection('clock_data').where({
        ymd: that.data.ymd,
        number: that.data.username,
      }).get({
        success: res => {
          console.log(res)
          if (res.data.length == 0) {
            wx.navigateTo({
              url: '../load/load?Ofi=' + that.data.Ofi + '&username=' + that.data.username,
            })
          }
        },
      })
    }
  }
})