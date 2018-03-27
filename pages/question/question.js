

const app = getApp()
// pages/list/question.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    clock: '',
    ischecked:'',
    questions:[
      { 'q': '刘备出生在哪里？', 'a': '北京', 'b': '南京', 'c': '东京', 'd': '中国','f':'d'},
      { 'q': '刘备出生在哪个朝代？', 'a': '秦朝', 'b': '汉朝', 'c': '三国', 'd': '元朝', 'f': 'b' },
      { 'q': '熊黛林的英文名叫什么？', 'a': 'Bear dailin', 'b': 'Xiong Dailin', 'c': 'Dailin Xiong', 'd': 'Jack Ma', 'f': 'c' },
      { 'q': '大白熊是什么动物的品种？', 'a': '狗', 'b': '猪', 'c': '猫', 'd': '人', 'f': 'a', 'end':'1'}
    ],
    q:'',
    options:['A','B','C','D'],
    F:'',
    selectedIndex:''
  },

 
  
  click: function(args){
    
    if (this.data.ischecked == '') {
      wx.setStorageSync('questionIndex', Number(wx.getStorageSync('questionIndex') + 1))
    }
    console.info('new number is ' + wx.getStorageSync('questionIndex'))
    this.setData({
      selectedIndex: args.currentTarget.dataset.index,
      ischecked: 'true',
     
    })
    
    if (wx.getStorageSync('endInd')!='') {
      console.log('End Page');
      return;
    }
   
  },

  hide: function () {
    var vm = this
    var interval = setInterval(function () {
      if (vm.data.winH > 0) {
        //清除interval 如果不清除interval会一直往上加
        clearInterval(interval)
        vm.setData({ winH: vm.data.winH - 5, opacity: vm.data.winH / winHeight })
        vm.hide()
      }
    }, 10);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (args) {
    console.log(this.data.questions.length)
    if (wx.getStorageSync('questionIndex') >= this.data.questions.length) {
      console.log('reset')
      wx.setStorageSync('questionIndex','1')
    }
    console.log('incoming number is ' + wx.getStorageSync('questionIndex'));
    count_down(this);
    
    
    var thisq = this.data.questions[wx.getStorageSync('questionIndex')];
    this.setData({
      clock:'',
      'q': thisq.q,
      'options.A': thisq.a,
      'options.B': thisq.b,
      'options.C': thisq.c,
      'options.D': thisq.d,
      'F': thisq.f,
      
    })
    if (thisq.end != undefined){
      wx.setStorageSync('endInd','1')
    } 
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.hide()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }


   
})

/** 
 * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
 * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
 * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
 * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
 */

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
var total_micro_second = 15 * 1000;

/* 毫秒级倒计时 */
function count_down(that) {
  
  
  
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second)
  });
  
  if (total_micro_second <= 0) {
    if (wx.getStorageSync('endInd') == '1') {
      console.log('no more count')
      wx.setStorageSync('endInd', '')
      return
    } 
    total_micro_second = 15 * 1000;
    wx.redirectTo({
      url: '../question/question',
    })
    // wx.redirectTo({
    //   url: '../question/question?id=1',
    // })

    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 1000;
    count_down(that);
  }, 1000)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  //var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
  return sec;//+ " " + micro_sec
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

