const db = wx.cloud.database()
Component({
  data: {
    username: '',
    days: [0, 0, 0]
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
      while (i < 3) {
        this.data.days[i++] = Math.floor(n % 10)
        n = Math.floor(n / 10)
      }
      this.setData({
        days: this.data.days
      })
    }
  }
})