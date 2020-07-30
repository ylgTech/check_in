const db = wx.cloud.database()

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    Ofi: false,
    password: '',
    username: '',
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  methods: {
    inputUsername: function (e) {
      console.log(e.detail.value)
      this.setData({
        username: e.detail.value
      })
    },
    inputPassword: function (e) {
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
    submit: function () {
      var that = this
      db.collection('accounts').where({
        username: that.data.username,
        password: that.data.password,
      }).get({
        success: res => {
          console.log(res)
          if (res.data.length != 0) {
            console.log(that.data.Ofi)
            this.triggerEvent('loginSuccess', {
              username: that.data.username
            })
            wx.showToast({
              title: '登录成功',
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