
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

    var myfinalScore = wx.getStorageSync('score');
    this.setData({
      finalScore: myfinalScore,
      isAlive: wx.getStorageSync('isAlive'),  
    })
    var name = wx.getStorageSync('myInfo').name
    wx.request({
      url: 'https://119759737.fxdafuweng.club/weapp/disableUser',
      data: {          //参数为json格式数据
        userName: name,
        status: 0,
        score: myfinalScore
      },
      success: function (res) {
      }
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
    var myscore = wx.getStorageSync('score')
    wx.clearStorageSync()
    wx.setStorageSync('myInfo', myInfo)
    wx.setStorageSync('myscore', myscore)
    console.info("remove all data")
    
  },
  goback: function(){
    this.clearAll()
    wx.reLaunch({
      url: '../index/index',
    })
  }
})