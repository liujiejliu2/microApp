
const app = getApp()
// pages/list/question.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    clock: (wx.getStorageSync('qinterval')+1),
    ischecked:'',
    questions: wx.getStorageSync('questionList'),
    qContent:'',
    options:['A','B','C','D'],
    F:'W',
    selectedIndex:'',
    finalColor:'background-color:yellow',
    currscore:'0',
    progress:'0',
    wxTimerList: {},
    alive:'',
    activeCount:''
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
  
  onHide: function () {
    wx.setStorageSync('exit', 1)
    wx.setStorageSync('isAlive', 0)
    var name = wx.getStorageSync('myInfo').name
    wx.request({
      url: 'https://119759737.fxdafuweng.club/weapp/disableUser',
      data: {          //参数为json格式数据
        userName: name,
        status: 0,
      },
      success: function (res) {
      }
    })
    console.info('hide');
    wx.redirectTo({
      url: '../ending/ending',
    })
    return;
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
          if (wx.getStorageSync('exit', 1)){
            wxTimer1.stop()
          }
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
            if (wx.getStorageSync('chance') < 1) {
              var name = wx.getStorageSync('myInfo').name
              wx.setStorageSync('isAlive', 0)
              wx.request({
                url: 'https://119759737.fxdafuweng.club/weapp/disableUser',
                data: {          //参数为json格式数据
                  userName: name,
                  status: 0,
                },
                success: function (res) {
                }
              })
            }
          }
        }
    })
    wxTimer1.start(this);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (args) {
    this.setData({
      clock: wx.getStorageSync('qinterval') + 1,
    })
    if (wx.getStorageSync('exit')==1){
      wx.setStorageSync('isAlive',0)
      wx.redirectTo({
        url: '../ending/ending',
      })
      return;
    }
    if (wx.getStorageSync('started')==""){
      wx.setStorageSync('started',1)
    }
    if (wx.getStorageSync('questionIndex') == 0) {
      wx.setStorageSync('chance', 2)
      wx.setStorageSync('isAlive', 1)
      console.log('reset')
      wx.setStorageSync('score', 0)
      wx.setStorageSync('questionIndex', 0)
      
    }
    if ( wx.getStorageSync('chance')<1){
      this.setData({
        ischecked: 'true',
        selectedIndex:'',
        alive: '没有机会了！现在你只能看着别人玩了！',
      })
    }else{
      this.setData({
        ischecked: '',
      })
    }
    this.timerCount(this);
  
    var current=this
    //获取当前存活玩家
    wx.request({
      url: 'https://119759737.fxdafuweng.club/weapp/activeUser',
      success: function (res) {
        current.setData({
          activeCount: res.data.data.msg[0].count
        })
      }
    })

    var currentIndex = wx.getStorageSync('questionIndex');
    
    if (this.data.questions==''){
      current.setData({
        questions: wx.getStorageSync('questionList')
      })
    }
    console.info("question size is " + this.data.questions.length)
    var thisq = this.data.questions[currentIndex];
    
    this.setData({
      progress: wx.getStorageSync('questionIndex')+1,
      qContent: thisq.q,
      'options.A': thisq.A,
      'options.B': thisq.B,
      'options.C': thisq.C,
      'options.D': thisq.D,
      'F': thisq.F,
      currscore:wx.getStorageSync('score'),
      mychance: wx.getStorageSync('chance')-1
    })
    if ((wx.getStorageSync('questionIndex') + 1) == this.data.questions.length){
      wx.setStorageSync('endInd','1')
    } 
  },
   
})

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
