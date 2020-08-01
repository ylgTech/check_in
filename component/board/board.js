const db = wx.cloud.database()
Component({
  options: {
    addGlobalClass: true
  },
  data: {
    username: '',
    password_old: '',
    password_new: '',
    days: [0, 0, 0, 0]
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.setData({
        username: getApp().globalData.username,
      })
    },
    moved: function () {},
    detached: function () {},
  },

  methods: {
    updateDays: function (n) {
      let i = 0
      while (i < 4) {
        this.data.days[i++] = Math.floor(n % 10)
        n = Math.floor(n / 10)
      }
      this.setData({
        days: this.data.days
      })
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    password: function (e) {
      var that = this
      that.setData({
        modalName: null
      })
      db.collection('accounts').where({
        username: that.data.username,
        password: that.data.password_old,
      }).get({
        success: res => {
          console.log(res)
          if (res.data.length != 0) {
            db.collection('accounts').doc(res.data[0]._id).update({
              data: {
                username: that.data.username,
                password: that.data.password_new,
              },
              success: res => {
                that.setData({
                  password_old: '',
                  password_new: '',
                })
                console.log(res)
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                })
              }
            })
          } else {
            wx.showToast({
              title: '请检查密码是否正确',
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
    },
    inputUsername: function (e) {
      console.log(e.detail.value)
      this.setData({
        password_old: e.detail.value
      })
    },
    inputPassword: function (e) {
      console.log(e.detail.value)
      this.setData({
        password_new: e.detail.value
      })
    },
  }
})