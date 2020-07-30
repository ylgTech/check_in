const db = wx.cloud.database()


Component({
  data: {
    username: '',
    a: 0,
    b: 0,
    c: 0,
    match_all: [],
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      let that = this
      let username = wx.getStorageSync('username')
      console.log(username)
      if (username) {
        that.setData({
          username: username
        })
      }
      db.collection('clock_data').where({
        number: that.data.username,
      }).get({
        success: res => {
          console.log(res)
          that.setData({
            match_all: res.data.reverse()
          })
        }
      })
    },
    moved: function () {},
    detached: function () {},
  },

  methods: {
    match_detail: function (e) {
      var that = this
      var id = e.currentTarget.dataset.id; // 获取点击的推文的数组下标
      that.data.match_all[id].show = !that.data.match_all[id].show
      that.setData({
        match_all: that.data.match_all
      })
      console.log(that.data.match_all[id].show)
    },
    delete: function (e) {
      var that = this
      var id = e.currentTarget.dataset.id; // 获取点击的推文的数组下标
      var _id = that.data.match_all[id]._id; // 通过id判断是哪个推文的链接
      db.collection('clock_data').doc(_id).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
          })
          db.collection('clock_data').where({
            number: that.data.username,
          }).get({
            success: res => {
              console.log(res)
              that.setData({
                match_all: res.data.reverse()
              })
            }
          })
        },
        fail: err => {
          wx.showToast({
            title: '删除失败',
            icon: 'none',
          })
        }
      })
    },
  }

})