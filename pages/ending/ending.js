
Page({
  data: {
    finalScore:'',
    isAlive:'',
    groupUrl:''
  },
  previewImage:function(){
    wx.previewImage({
      urls: [this.data.groupUrl],
    })
  },
  onLoad: function () {
    this.setData({
      groupUrl: wx.getStorageSync('groupUrl')
    });
    
    var current = this
    wx.request({
      url: 'https://119759737.fxdafuweng.club/weapp/activeUser',
      success: function (res) {
        current.setData({
          mybonus: (wx.getStorageSync('bonus') / res.data.data.msg[0].count).toFixed(2)
        })
      }
    })
    this.setData({
      finalScore:wx.getStorageSync('score'),
      isAlive: wx.getStorageSync('isAlive'),  
    })
    
  },
  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例  
    var viewWidth = 200,           //设置图片显示宽度，  
      viewHeight = 200 / ratio;    //计算的高度值     
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  }  ,
  clearAll: function(){
    var myInfo = wx.getStorageSync('myInfo')
    wx.clearStorageSync()
    wx.setStorageSync('myInfo', myInfo)
    console.info("remove all data")
    
  },
  goback: function(){
    this.clearAll()
    wx.reLaunch({
      url: '../index/index',
    })
  }
})