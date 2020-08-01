const db = wx.cloud.database()
Component({
  data: {
    username: '',
    total: 0,
    days: [0, 0, 0]
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.getTotal()
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
        days: this.data.days.reverse()
      })
    },

    getTotal: function () {
      wx.showLoading({
        title: '加载中~',
      })
      db.collection('clock_data').count({
        success: res => {
          console.log(res)
          this.updateDays(res.total)
          this.setData({
            total: res.total
          })
        },
        fail: res => {
          console.log(res)
        },
        finally: res => {
          wx.hideLoading({
            complete: (res) => {},
          })
        }
      })
    },

    descTotal: function () {
      this.updateDays(this.data.total - 1)
    }
  }
})