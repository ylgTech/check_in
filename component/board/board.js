const db = wx.cloud.database()
Component({
  data: {
    username: '',
    a: 0,
    b: 0,
    c: 0,
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      let that = this
      let username = wx.getStorageSync('username')
      console.log(username)
      if (username) {
        that.setData({
          username: username,
        })
      }
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
    },
    moved: function () {},
    detached: function () {},
  },
})