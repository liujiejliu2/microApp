
Page({
  data: {
    finalScore:''
  },
  onLoad: function () {
    this.setData({
      finalScore:wx.getStorageSync('score')
    })
  }
})