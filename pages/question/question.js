
const app = getApp()
// pages/list/question.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    clock: 16,
    ischecked:'',
    questions:[
      { 'q': '刘备出生在哪里？', 'A': '北京', 'B': '南京', 'C': '东京', 'D': '中国','F':'D'},
      { 'q': '刘备出生在哪个朝代？', 'A': '秦朝', 'B': '汉朝', 'C': '三国', 'D': '元朝', 'F': 'B' },
      { 'q': '熊黛林的英文名叫什么？', 'A': 'Bear dailin', 'B': 'Xiong Dailin', 'C': 'Dailin Xiong', 'D': 'Jack Ma', 'F': 'C' },
      { 'q': '大白熊是什么动物的品种？', 'A': '狗', 'B': '猪', 'C': '猫', 'D': '人', 'F': 'A', 'end':'1'}
    ],
    q:'',
    options:['A','B','C','D'],
    F:'',
    selectedIndex:'',
    finalColor:'background-color:yellow',
    currscore:'0',
    progress:'0',
    wxTimerList: {}
  },

 
  
  click: function(args){    
    this.setData({
      selectedIndex: args.currentTarget.dataset.index,
      ischecked: 'true'
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

  timerCount:function(that){
    var wxTimer1 = new wxTimer({
      beginTime: "00:00:" + this.data.clock,
        complete: function () {
          wx.setStorageSync('questionIndex', Number(wx.getStorageSync('questionIndex') + 1))
          if (wx.getStorageSync('endInd') == '1') {
            console.log('no more count')
            wx.setStorageSync('endInd', '')
            wx.redirectTo({
              url: '../ending/ending',
            })
            return;
          }

          wx.redirectTo({
            url: '../question/question',
          })

        },
        interval: this.data.clock -1,
        intervalFn: function () {
          if (wx.getStorageSync('firstInterval')==""){
            wx.setStorageSync('firstInterval',1);
            return;
          }else{
            wx.removeStorageSync('firstInterval');
          }
          console.log('color is ' + that.data.finalColor)
          if (that.data.ischecked == 'true' && that.data.selectedIndex == that.data.F) {
            that.setData({
              finalColor: 'background-color:greenyellow'
            })            
            console.info('score +=1')
            wx.setStorageSync('score', Number(wx.getStorageSync('score')) + 1)
          } else {
            if (wx.getStorageSync('chance') > 0) {
              wx.setStorageSync('chance', wx.getStorageSync('chance') - 1)
            }
            that.setData({
              finalColor: 'background-color:red'
            })
          }
        }

    })
    wxTimer1.start(this);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (args) {
    if (wx.getStorageSync('started')==""){
      wx.setStorageSync('started',1)
    }
    if (wx.getStorageSync('questionIndex') == 0) {
      console.log('reset')
      wx.setStorageSync('questionIndex','0')
      wx.setStorageSync('score', '0')
      wx.setStorageSync('chance', 2)
    }
    if ( wx.getStorageSync('chance')<1){
      this.setData({
        ischecked: 'true',
      })
    }else{
      this.setData({
        ischecked: '',
      })
    }
    this.timerCount(this);
    // count_down(this);
    
    
    var thisq = this.data.questions[wx.getStorageSync('questionIndex')];
    this.setData({
      progress: (wx.getStorageSync('questionIndex')+1) / this.data.questions.length*100,
      clock:'',
      'q': thisq.q,
      'options.A': thisq.A,
      'options.B': thisq.B,
      'options.C': thisq.C,
      'options.D': thisq.D,
      'F': thisq.F,
      currscore:wx.getStorageSync('score'),
      mychance: wx.getStorageSync('chance')-1
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
var totalNum = 10;
var total_micro_second = totalNum * 1000;

/* 毫秒级倒计时 */
function count_down(that) {
  
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second)
  });
  if (total_micro_second <= 500) {
    
    console.log('color is ' + that.data.finalColor)
    if (that.data.selectedIndex == that.data.F) {
      that.setData({
        finalColor: 'background-color:greenyellow'
      })
      if (that.data.ischecked == 'true') {
          console.info('score +=1')
          wx.setStorageSync('score', Number(wx.getStorageSync('score'))+1)
      }
    } else {
      if (wx.getStorageSync('chance')>0){
        wx.setStorageSync('chance', wx.getStorageSync('chance') - 1)
      }
      that.setData({
        finalColor: 'background-color:red'
      })
    }
    
  }
  if (total_micro_second <= 0) {
    total_micro_second = totalNum * 1000;
    wx.setStorageSync('questionIndex', Number(wx.getStorageSync('questionIndex') + 1))
    if (wx.getStorageSync('endInd') == '1') {
      console.log('no more count')
      wx.setStorageSync('endInd', '')
      wx.redirectTo({
        url: '../ending/ending',
      })
      return;
    } 

    wx.redirectTo({
      url: '../question/question',
    })
 
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



var wxTimer = function (initObj) {
  initObj = initObj || {};
  this.beginTime = initObj.beginTime || "00:00:00";	//开始时间
  this.interval = initObj.interval || 0;				//间隔时间
  this.complete = initObj.complete;					//结束任务
  this.intervalFn = initObj.intervalFn;				//间隔任务
  this.name = initObj.name;							//当前计时器在计时器数组对象中的名字

  this.intervarID;									//计时ID
  this.endTime;										//结束时间
  this.endSystemTime;									//结束的系统时间
}

wxTimer.prototype = {
  //开始
  start: function (self) {
    this.endTime = new Date("1970/01/01 " + this.beginTime).getTime();//1970年1月1日的00：00：00的字符串日期
    this.endSystemTime = new Date(Date.now() + this.endTime);
    var mydata = this;
    //开始倒计时
    var count = 0;//这个count在这里应该是表示s数，js中获得时间是ms，所以下面*1000都换成ms
    function begin() {
      var tmpTime = new Date(mydata.endTime - 1000 * count++);
      //把2011年1月1日日 00：00：00换成数字型，这样就可以直接1s，1s的减，就变成了倒计时，为了看的更明确，又用new date把字符串换回来了
      var tmpTimeStr = tmpTime.toString().substr(16, 8);//去掉前面的年月日就剩时分秒了
      var wxTimerSecond = (tmpTime.getTime() - new Date("1970/01/01 00:00:00").getTime()) / 1000;
      var wxTimerList = self.data.wxTimerList;

      //更新计时器数组
      wxTimerList[mydata.name] = {
        wxTimer: tmpTimeStr,
        wxTimerSecond: wxTimerSecond,
      }

      self.setData({
        wxTimer: tmpTimeStr,
        wxTimerSecond: wxTimerSecond,
        wxTimerList: wxTimerList
      });
      //时间间隔执行函数
      if (0 == (count - 1) % mydata.interval && mydata.intervalFn) {
        mydata.intervalFn();
      }
      //结束执行函数
      if (wxTimerSecond <= 0) {
        if (mydata.complete) {
          mydata.complete();
        }
        mydata.stop();
      }
    }
    begin();
    this.intervarID = setInterval(begin, 1000);
  },
  //结束
  stop: function () {
    clearInterval(this.intervarID);
  },
  //校准
  calibration: function () {
    this.endTime = this.endSystemTime - Date.now();
  }
}
