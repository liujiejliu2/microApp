/** 
 * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
 * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
 * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
 * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
 */

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数

var total_micro_second ;
var px2rpx = 2, windowWidth = 375;
var myTimer;
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
    myTimer = this;
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
      if (10 == wxTimerSecond){
        self.setData({
          prepare:true
        });
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
    this.endTime = this.endSystemTime - (Date.now()) ;
  }
}

var wxTimer1;
Page({
  data: {
    clock: '59',
    wxTimerList: {},
    imageSize: {},
    prepare:false
  },

  timerCount: function (that) {
    wxTimer1 = new wxTimer({
      beginTime: this.data.clock,
      name: 'countDown',
      complete: function () {
        wx.redirectTo({
          url: '../question/question?id=1',
        })
      }, 
    })
    wxTimer1.start(this);
  },
  
  countNow:function(){
    var timelineStr = this.data.startTime
    var splitTime = timelineStr.split(" ");
    var arr1 = splitTime[1].split(":");
    var sdate = splitTime[0].split('-');
    var timeline = new Date(sdate[0], sdate[1] - 1, sdate[2], arr1[0], arr1[1], arr1[2])

    var now = new Date();
    timeline.setMinutes(Math.ceil(timeline.getMinutes() / 1) * 1);
    if (timeline.getMinutes() == now.getMinutes()) {
      timeline.setMinutes(timeline.getMinutes() + 1);
    }
    timeline.setSeconds(0);
    var now = new Date();
    now.setMilliseconds(0)
    this.setData({
      timeline: timeline,
    });
    total_micro_second = (timeline - now) / 1000;
    console.log("timeline is " + total_micro_second)
    var t;
    if (total_micro_second > -1) {
      var hour = Math.floor(total_micro_second / 3600);
      var min = Math.floor(total_micro_second / 60) % 60;
      var sec = total_micro_second % 60;
      if (hour < 10) {
        t = '0' + hour + ":";
      } else {
        t = hour + ":";
      }

      if (min < 10) { t += "0"; }
      t += min + ":";
      if (sec < 10) { t += "0"; }
      t += sec;
    }
    this.setData({
      clock: t
    });
    this.timerCount(this);
  
  },
  onShow:function(){
    var current = this;
    wx.request({
      url: 'https://119759737.fxdafuweng.club/weapp/getSchedule',
      success: function (res) {
        if (res.data.data == undefined) {
          console.log("error!")
        } else {
          wx.setStorageSync('bonus', res.data.data.msg.bonus)
          wx.setStorageSync('groupUrl', res.data.data.msg.groupUrl)
          current.setData({
            startTime: res.data.data.msg.startTime,
            bouns: res.data.data.msg.bonus,
            qinterval: res.data.data.msg.qinterval
          });
          wx.setStorageSync('testInd', res.data.data.msg.testind)
          wx.setStorageSync('qinterval', res.data.data.msg.qinterval)
          wx.getSystemInfo({
            success: function (res) {
              windowWidth = res.windowWidth;
              px2rpx = 750 / windowWidth;
            }
          })

          if (myTimer != undefined) {
            myTimer.stop()
          }
          current.countNow()

          var name = wx.getStorageSync('myInfo').name
          wx.request({
            url: 'https://119759737.fxdafuweng.club/weapp/disableUser',
            data: {          //参数为json格式数据
              userName: name,
              status: 1,
            },
            success: function (res) {
            }
          })
          wx.request({
            url: 'https://119759737.fxdafuweng.club/weapp/getQuestions',

            success: function (res) {
              wx.removeStorageSync('questionList')
              console.info(res.data.data.msg)
              wx.setStorageSync('questionList', res.data.data.msg)
              current.setData({
                qsize: res.data.data.msg.length,
              });
            }
          })
        }
      }
    })
    // if (myTimer!=undefined){
    //   myTimer.stop()
    //   this.countNow()
    // }
  },

  imageLoad: function (e) {
    var originWidth = e.detail.width * px2rpx,
      originHeight = e.detail.height * px2rpx,
      ratio = originWidth / originHeight;
    var viewWidth = 220, viewHeight = 165, viewRatio = viewWidth / viewHeight;
    if (ratio >= viewRatio) {
      if (originWidth >= viewWidth) {
        viewHeight = viewWidth / ratio;
      } else {
        viewWidth = originWidth;
        viewHeight = originHeight
      }
    } else {
      if (originWidth >= viewWidth) {
        viewWidth = viewRatio * originHeight
      } else {
        viewWidth = viewRatio * originWidth;
        viewHeight = viewRatio * originHeight;
      }
    }
    var image = this.data.imageSize;
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      imageSize: image
    })
  },

  onLoad: function () {
  },
});