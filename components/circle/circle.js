// components/circle/circle.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* id : canvas 组件的唯一标识符 canvas-id ，x : canvas 绘制圆形的半径， w : canvas 绘制圆环的宽度  */
    drawCircleBg: function (id, x, w) {
      // 设置圆环外面盒子大小 宽高都等于圆环直径
      this.setData({
        size: 2 * x
      });
      // 使用 wx.createContext 获取绘图上下文 ctx  绘制背景圆环
      var ctx = wx.createCanvasContext(id)
      ctx.setLineWidth(w / 2); ctx.setStrokeStyle('#20183b'); ctx.setLineCap('round')
      ctx.beginPath();//开始一个新的路径
      //设置一个原点(x,y)，半径为r的圆的路径到当前路径 此处x=y=r
      ctx.arc(x, x, x - w, 0, 2 * Math.PI, false);
      ctx.stroke();//对当前路径进行描边
      ctx.draw();
    },
    drawCircle: function (id, x, w, step) {
      // 使用 wx.createContext 获取绘图上下文 context  绘制彩色进度条圆环
      var context = wx.createCanvasContext(id);
      // 设置渐变
      var gradient = context.createLinearGradient(2 * x, x, 0);
      gradient.addColorStop("0", "#2661DD"); gradient.addColorStop("0.5", "#40ED94"); gradient.addColorStop("1.0", "#5956CC");
      context.setLineWidth(w); context.setStrokeStyle(gradient); context.setLineCap('round')
      context.beginPath();//开始一个新的路径
      // step 从0到2为一周
      context.arc(x, x, x - w, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
      context.stroke();//对当前路径进行描边
      context.draw()
    },
    _runEvent() {
      //触发自定义组件事件
      this.triggerEvent("runEvent")
    }
  },
})
