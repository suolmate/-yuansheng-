 /*
  1 页面加载的时候
     1.1 从缓存中获取购物车数据 渲染到页面中
     这些数据的 checked = true
  2 微信支付
    1 那些人 那些账号 可以实现微信支付
      1.1 企业账号
      1.2 企业账号的小程序后台中 必须 给开发者 添加上白名单 
        1.2.1 一个appid 可以绑定多个开发者 这些开发者就可以公用这个appid和他的开发权限     
  */
import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({
  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0,

  },
  onShow(){
    // 获取缓存中的收货信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart")||[];
    // 过滤后的购物车数组
    cart=cart.filter(v=>v.checked)
    this.setData({address})

      //总价格 总数量
      let totalPrice=0;
      let totalNum=0;
      cart.forEach(v=>{
          totalPrice+=v.num*v.goods_price;
          totalNum+=v.num;
      })
     
      this.setData({
        cart,
        totalPrice,
        totalNum,
        address
      });
  },
  handlePay(){
    // console.log("支付");
    wx.showModal({
      // title: '提示',
      content: '确定支付',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          showToast({title:"支付成功"});
          //手动删除缓冲中 直接支付的商品
          let newCart=wx.getStorageSync("cart")
          newCart=newCart.filter(v=>!v.checked)
          wx.setStorageSync("cart", newCart);
          
          wx.navigateTo({
            url: '/pages/order/order',
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }




})
