//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '请输入真实姓名：',
    userInfo: {},
    userName:"",
    enable:"",
    confirm: true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  bindViewDemo: function(){
    wx.navigateTo({
      url: '../demo/demo',
    })
  },

  userNameInput:function(e){
    this.setData({
      userName: e.detail.value
    })
  },

  modalBindcancel: function () {
    this.setData({
      confirm: !this.data.confirm,
    })
  },  

  modalBindaconfirm: function () {
    
    this.setData({
      confirm: !this.data.confirm,
    })
    
    this.goCountdown()
  },  
  
  goCountdown:function(){
    wx.request({
      url: 'https://119759737.fxdafuweng.club/weapp/addUser',
      data: {          //参数为json格式数据
        userName: this.data.userName,
      },
      header: {
        //设置参数内容类型为json
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.data.msg == undefined) {
          console.log("error!")
        } else {
          var userInfo = res.data.data.msg;
          wx.setStorageSync('myInfo', userInfo)
        }
      }
    })
    wx.navigateTo({
      url: '../countdown/countdown',
    })
  },

  bindViewCountdown: function () {

    if (this.data.userName.trim() == '') {
      wx.showToast({ title: '请输入真实姓名', duration: 2000 })
      setTimeout(function () { wx.hideToast() }, 2000)
      return
    }
    if (this.data.enable == '') {
      this.setData({
        confirm: !this.data.confirm
      }) 
    }else{
      this.goCountdown()
    }
  },

  onLoad: function (e) {
    if(wx.getStorageSync('myInfo')!=''){
      
      var myInfo = wx.getStorageSync('myInfo')
      console.info(myInfo)
      this.setData({
        userName: myInfo.name,
        enable:true
      })
    }
    if (wx.getStorageSync('started')!="") {
      wx.redirectTo({
        url: '../ending/ending',
      })
      return;
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
})
