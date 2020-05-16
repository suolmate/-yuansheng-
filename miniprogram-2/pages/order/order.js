// pages/order/order.js
 /*
 (onShow不同于onLoad的 无法在形参上接收options参数)
    判断缓存中有没有token
     没有 就跳转到授权页面
     有 直接往下进行
  1 页面被打开的时候 onShow
   1.1 获取url上的参数type
   1.2 根据type 去发送请求获取订单数据
   1.3 渲染页面
  2 点击不同标题 重新发送请求来获取和渲染数据 
   */
  import{ request} from "../../request/index.js";
  import regeneratorRuntime from "../../lib/runtime/runtime"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部订单",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      },
    ],
  },

  onShow(options){
    const token = wx.getStorageSync("token");
    // if(!token){
    //   wx.navigateTo({
    //     url: '/pages/auth/auth',
    //   });
    //   return;
    // }
    // 1 获取当前小程序的页面栈-数组 长度最大是10页面
    let pages =   getCurrentPages();
    // console.log(pages)
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage=pages[pages.length-1]
    console.log(currentPage.options);
    
    
    // 获取url上的type参数
    const {type}=currentPage.options
    // 激活选中页面标题 当type=1 index=0
    // this.changeTitleByIndex(type-1);
    this.getOreders(type);
   
    // console.log(options);    

  },
  // 获取订单列表的方法
  async getOreders(type){
    const res = await request({url:"https://api-hmugo-web.itheima.net/api/public/v1/my/orders/all",data:{type}});
    this.setData({
      orders:res
    })
  },
 //根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    // 2 修改源数据
    let {tabs} = this.data;
        // v是循环项 i是索引
        tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
        // 3 赋值到data中
        this.setData({
          tabs
        })
  },

  handTabsItemChange(e){
    // console.log(e)
    // 1 获取被点击的标题索引
    const {index} = e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求
    this.getOreders(index+1)
  },


})