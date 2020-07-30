//index.js
//获取应用实例
var util = require('../../utils/util.js');
const db = wx.cloud.database()

Page({
  data: {
    username: '',
    checkSuccess: false,
    fileUrl:'',
  },

  onLoad: function () {
    let that = this
    let username = wx.getStorageSync('username')
    let ymd = util.formatTime_ymd(new Date());
    console.log(username)
    //读取users表数据
    wx.cloud.callFunction({
      name: "getUsers",
      success(res) {
        console.log("读取成功", res.result.data)
        that.savaExcel(res.result.data)
      },
      fail(res) {
        console.log("读取失败", res)
      }
    })
    if (username) {
      that.setData({
        username: username
      })
    }
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
    // let checkInfo = wx.getStorageSync('checkInfo')
    // console.log(checkInfo)
    // if (checkInfo == ymd) {
    //   that.setData({
    //     checkSuccess: true
    //   })
    // }
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

  info:function(e){
    this.savaExcel();
    this.getFileUrl();
    this.copyFileUrl();
  },

  //把数据保存到excel里，并把excel保存到云存储
  savaExcel(userdata) {
    let that = this
    wx.cloud.callFunction({
      name: "excel",
      data: {
        userdata: userdata
      },
      success(res) {
        console.log("保存成功", res)
        that.getFileUrl(res.result.fileID)
      },
      fail(res) {
        console.log("保存失败", res)
      }
    })
  },

  //获取云存储文件下载地址，这个地址有效期一天
  getFileUrl(fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        // get temp file URL
        console.log("文件下载链接", res.fileList[0].tempFileURL)
        that.setData({
          fileUrl: res.fileList[0].tempFileURL
        })
      },
      fail: err => {
        // handle error
      }
    })
  },
  //复制excel文件下载链接
  copyFileUrl() {
    let that = this
    wx.setClipboardData({
      data: that.data.fileUrl,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res) // data
          }
        })
      }
    })
  }
})