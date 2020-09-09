var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const db = wx.cloud.database()
var qqmapsdk = new QQMapWX({
  key: 'ZVDBZ-VBUHQ-CRJ55-GRU7W-FDACJ-B4BMW'
});

Component({
  options: {
    addGlobalClass: true
  },

  data: {
    username: '',
    filePath: '',
    ymd: '',
    hm: '',
    location: '点击获取地点',
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.setData({
        username: getApp().globalData.username,
      })
      this.getTime();
    },
    moved: function () {},
    detached: function () {},
  },

  methods: {
    chooseImage() {
      let that = this;
      wx.chooseImage({
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let filePath = res.tempFilePaths[0];
          that.setData({
            filePath: filePath
          })
        }
      })
    },

    uploadImage: function () {
      let that = this
      const filePath = that.data.filePath
      const name = that.data.username + Math.random() * 1000000;
      const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
      wx.showLoading({
        title: '上传图片中~',
      })
      wx.cloud.uploadFile({
        cloudPath, //云存储图片名字
        filePath, //临时路径
        success: res => {
          console.log('[上传图片] 成功：', res)
          let fileID = res.fileID;
          //把图片存到users集合表
          db.collection("clock_data").add({
            data: {
              number: that.data.username,
              ymd: that.data.ymd,
              hm: that.data.hm,
              img: fileID,
              location: that.data.location,
              show: true,
            },
            success: function () {
              wx.showToast({
                title: '打卡成功！',
              })
              wx.setStorageSync('lastCheckDate', that.data.ymd)
              that.triggerEvent('checkSuccess', {})
            },
            fail: function () {
              wx.showToast({
                title: '打卡失败，请检查网络~',
                icon: 'none',
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          });
        },
        fail: function () {
          wx.showToast({
            title: '打卡失败，请检查网络~',
            icon: 'none',
          })
        },
        complete: () => {
          wx.hideLoading()
        }
      });
    },

    getTime: function () {
      var that = this
      let date = new Date()
      var ymd = util.formatTime_ymd(date);
      var hour = util.formatDate_hour(date);
      var minute = util.formatDate_minute(date);
      if (hour[0] < 10) {
        hour = hour % 10
      }
      var hm = hour + ':' + minute
      that.setData({
        ymd: ymd,
        hm: hm,
      })
    },

    getLocation() {
      var _this = this;
      qqmapsdk.reverseGeocoder({
        location: '',
        success: function (res) {
          console.log(res);
          _this.setData({
            location: res.result.formatted_addresses.recommend
          })
        },
        fail: function (error) {
          console.error(error)
        }
      })
    },

    check: function () {
      let that = this
      if (that.data.ymd == '' || that.data.location == '点击获取地点') {
        wx.showToast({
          title: '请获取地点~',
          icon: 'none'
        })
        return
      }
      that.uploadImage();
    }
  }

})