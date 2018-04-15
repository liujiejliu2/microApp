
const app = getApp()
// pages/list/question.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    clock: 11,
    ischecked:'',
    questions:[
      
      { 'q': '工笔是哪种绘画形式的技法？', 'A': '水彩画', 'B': '油画', 'C': '水粉画', 'D': '国画','F':'D'},
      { 'q': '人体含水量百分比最高的器官是？', 'A': '肝', 'B': '肾', 'C': '眼球', 'D': '心脏', 'F': 'C' },
      { 'q': '中国民间“送灶神”时要吃粘牙的甜食，这是为了？', 'A': '容易打发小孩子', 'B': '是灶神喜欢的食品', 'C': '甜为吉利', 'D': '用糖粘住灶神的牙', 'F': 'D' },
      { 'q': '清朝晚期,被今人誉为"开眼看世界第一人"的是谁？', 'A': '魏源', 'B': '龚自珍', 'C': '林则徐', 'D': '严复', 'F': 'C' },
      { 'q': '下面属于可再生能源的是？', 'A': '太阳能', 'B': '电力', 'C': '煤炭', 'D': '石油', 'F': 'A' },
      { 'q': '以下哪种方法是节约用水的好办法？', 'A': '用公司的水', 'B': '在厕所水箱里放一块砖头', 'C': '让水龙头滴水不走水表', 'D': '不上厕所', 'F': 'B' },
      { 'q': '《在那遥远的地方》是哪里的民歌？', 'A': '四川民歌', 'B': '江苏民歌', 'C': '青海民歌', 'D': '云南民歌', 'F': 'C' },
      { 'q': '下列地点与电影奖搭配不正确的是？', 'A': '柏林-圣马克金狮', 'B': '戛纳-金棕榈', 'C': '洛杉矶-奥斯卡', 'D': '中国-金鸡', 'F': 'A' },
      { 'q': '下面哪种酸，人在品尝时不是酸味的？', 'A': '琥珀酸', 'B': '苹果酸', 'C': '柠檬酸', 'D': '单宁酸', 'F': 'D' },
      { 'q': '飞机票头等舱的票价一般为普通舱票价的？', 'A': '200%', 'B': '180%', 'C': '150%', 'D': '130%', 'F': 'C' },
      { 'q': '世界上最高的立式佛像--巴米杨佛在哪个国家？', 'A': '印度尼西亚', 'B': '伊拉克', 'C': '阿富汗', 'D': '尼泊尔', 'F': 'C' },
      { 'q': '新中国成立后,第一次参加奥运会是在哪一年？', 'A': '1952 ', 'B': '1956', 'C': '1980 ', 'D': '1984', 'F': 'A', 'end':'1'}
    ],
    qContent:'',
    options:['A','B','C','D'],
    F:'',
    selectedIndex:'',
    finalColor:'background-color:yellow',
    currscore:'0',
    progress:'0',
    wxTimerList: {},
    alive:''
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
    console.info('hide');
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
    if (wx.getStorageSync('exit')==1){
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
      console.log('reset')
      wx.setStorageSync('score', 0)
      wx.setStorageSync('questionIndex', 0)
    }
    if ( wx.getStorageSync('chance')<1){
      this.setData({
        ischecked: 'true',
        alive: '没有机会了！现在你只能看着别人玩了！',
      })
    }else{
      this.setData({
        ischecked: '',
      })
    }
    this.timerCount(this);
    var thisq = this.data.questions[wx.getStorageSync('questionIndex')];
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
    if (thisq.end != undefined){
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
