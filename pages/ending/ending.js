
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
    wx.removeStorageSync("exit")
    wx.removeStorageSync('firstInterval')
    console.info("remove all data")
    wx.reLaunch({
      url: '../index/index',
    })
    
  }
})