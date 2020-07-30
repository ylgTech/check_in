//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    Ofi: false,
    password: '',
    username: '',
    windowHeight: 0,
    statusBarHeight: 0,
    titleBarHeight: 0,
    windowWidth: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    this.getWindowHeight();
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
    if (e.detail.value.length == 1) {
      this.setData({
        Ofi: true
      })
    } else {
      this.setData({
        Ofi: false
      })
    }
  },
  submit: function (e) {
    var that = this
    if (that.data.Ofi == true) {
      db.collection('Special_login').where({
        username: that.data.username,
        password: that.data.password,
      }).get({
        success: res => {
          console.log(res)
          if (res.data.length != 0) {
            console.log(that.data.Ofi)
            wx.navigateTo({
              url: '../show/show?Ofi=' + that.data.Ofi + '&username=' + that.data.username,
            })
          } else {
            wx.showToast({
              title: '请检查账号密码是否正确',
              icon: 'none'
            })
          }
        },
        catch: res => {
          wx.showToast({
            title: '网络繁忙，请稍后再试',
            icon: 'none'
          })
        }
      })
    } else {
      db.collection('normal_login').where({
        username: that.data.username,
        password: that.data.password,
      }).get({
        success: res => {
          console.log(res)
          if (res.data.length != 0) {
            wx.navigateTo({
              url: '../show/show?Ofi=' + that.data.Ofi + '&username=' + that.data.username,
            })
          } else {
            wx.showToast({
              title: '请检查账号密码是否正确',
              icon: 'none'
            })
          }
        },
        catch: res => {
          wx.showToast({
            title: '网络繁忙，请稍后再试',
            icon: 'none'
          })
        }
      })
    }
  }
})