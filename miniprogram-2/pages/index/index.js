// 引入 发送请求的方法
import{ request} from "../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList:[],
    // 导航数组
    catesList:[],
    // 楼层数据
    floorList:[],
  },

  /**
   * 生命周期函数--监听页面加载 页面开始就加载 触发
   */ 
  onLoad: function (options) {
    // 1发送异步请求获取轮播图请求
    // 优化的手段可以通过es6的promise来解决
  //  wx.request({
  //    url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',    
  //    success:(result)=>{
  //    //成功执行的回调函数
  //    this.setData({
  //      swiperList:result.data.message
  //    })
  //    },
  //    fail:()=>{
  //    //失败执行的回调函数
  //     console.log("失败了")
  //    },
  //    complete:()=>{
  //       //成功 失败都会执行的回调函数
  //    }
  //  });
   
   this.getSwiperList();  // 调用轮播图方法
   this.getcatesList(); // 调用分类方法
   this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList(){
    request({url:'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata'})
    .then(result=>{
      this.setData({
        swiperList:result.data.message
        })
      })
  },
   // 获取分类导航数据
   getcatesList(){
    request({url:'https://api-hmugo-web.itheima.net/api/public/v1/home/catitems'})
    .then(result=>{
      this.setData({
        catesList:result.data.message
        })
      })
  },
    // 获取楼层数据
    getFloorList(){
      request({url:'https://api-hmugo-web.itheima.net/api/public/v1/home/floordata'})
      .then(result=>{
        this.setData({
          floorList:result.data.message
          })
        })
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