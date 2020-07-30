//index.js
//获取应用实例
var util = require('../../utils/util.js');
const db = wx.cloud.database()

Page({
  data: {
    username: '',
    checkSuccess: false
  },

  onLoad: function () {
    let that = this
    let username = wx.getStorageSync('username')
    let ymd = util.formatTime_ymd(new Date());
    console.log(username)
    if (username) {
      that.setData({
        username: username
      })
    }
    let checkInfo = wx.getStorageSync('lastCheckDate')
    console.log(checkInfo)
    if (checkInfo == ymd) {
      that.setData({
        checkSuccess: true
      })
    } else {
      db.collection('clock_data').where({
        number:username,
        ymd:ymd,
      }).get({
        success:res=>{
          if(res.data.length!=0)
          {
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
  }
})