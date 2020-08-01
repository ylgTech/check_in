const db = wx.cloud.database()

Component({
  options: {
    addGlobalClass: true
  },

  data: {
    username: '',
    all: false,
    list: [],
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      let that = this
      this.setData({
        username: getApp().globalData.username,
      })
      wx.showLoading({
        title: '加载中~',
      })
      let number = that.data.username == 'admin' ? undefined : that.data.username
      db.collection('clock_data').where({
        number: number,
      }).orderBy('ymd', 'desc').get({
        success: res => {
          console.log(res)
          that.setData({
            list: res.data
          })
        },
        fail: res => {
          wx.showToast({
            title: '请检查网络~',
            icon: 'none'
          })
        },
        complete: res => {
          wx.hideLoading({})
        }
      })
    },
    moved: function () {},
    detached: function () {},
  },

  methods: {
    showall: function (e) {
      var that = this
      var all = !that.data.all
      that.setData({
        all: all,
      })
      let number = undefined
      db.collection('clock_data').where({
        number: number,
      }).orderBy('ymd', 'desc').get({
        success: res => {
          console.log(res)
          that.setData({
            list: res.data
          })
        },
        fail: res => {
          wx.showToast({
            title: '请检查网络~',
            icon: 'none'
          })
        },
        complete: res => {
          wx.hideLoading({})
        }
      })
    },
    showone: function (e) {
      var that = this
      var all = !that.data.all
      that.setData({
        all: all,
      })
      let number = that.data.username
      db.collection('clock_data').where({
        number: number,
      }).orderBy('ymd', 'desc').get({
        success: res => {
          console.log(res)
          that.setData({
            list: res.data
          })
        },
        fail: res => {
          wx.showToast({
            title: '请检查网络~',
            icon: 'none'
          })
        },
        complete: res => {
          wx.hideLoading({})
        }
      })
    },
    match_detail: function (e) {
      var that = this
      var id = e.currentTarget.dataset.id; // 获取点击的推文的数组下标
      that.data.list[id].show = !that.data.list[id].show
      that.setData({
        list: that.data.list
      })
    },

    delete: function (e) {
      var that = this
      wx.showLoading({
        title: '删除中~',
      })
      var id = e.currentTarget.dataset.id; // 获取点击的推文的数组下标
      var _id = that.data.list[id]._id; // 通过id判断是哪个推文的链接
      db.collection('clock_data').doc(_id).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
          })
          that.data.list.splice(id, 1)
          that.setData({
            list: that.data.list
          })
          that.triggerEvent('DescTotal', {})
        },
        fail: err => {
          console.log(err)
          wx.showToast({
            title: '删除失败',
            icon: 'none',
          })
        }
      })
    },
  }

})