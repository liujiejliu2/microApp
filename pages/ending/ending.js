
Page({
  data: {
    finalScore:''
  },
  onLoad: function () {
    this.setData({
      finalScore:wx.getStorageSync('score')
    })
  },

  clearAll: function(){
    wx.removeStorageSync("started")
    wx.removeStorageSync("questionIndex")
    wx.removeStorageSync("chance")
    wx.removeStorageSync("score")
    wx.removeStorageSync("endInd")
    console.info("remove all data")
  }
})