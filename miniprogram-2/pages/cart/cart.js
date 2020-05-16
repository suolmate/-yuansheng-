// pages/cart/cart.js
// 总价格和总数量
// 1 都需要商品被选中才会计算
//  2 获取购物车数组
// 3 遍历
// 4 判断商品是否被选中
// 5 总价格 += 商品的单价 * 商品数量    总数量 +=商品数量
// 6 把计算后的价格和数量 设置回data中即可
 

/*
============商品的选中事件===========
 1 绑定chang事件
 2 获取到被修改的商品对象
 3 商品对象的选中状态取反  
 4 重新填充回data中和缓存中
 5 重新计算全选 总价格 总数量
*/
/*
 ==========全选和反选======
 1 全选复选框绑定事件 change
 2 获取data中的全选变量 allChecked
 3 直接取反 allChecked
 4 值改变后 遍历购物车数组 让里面的商品选中状态跟随 allChecked改变而改变
 5 吧购物车数组和allChecked 重新设置回data中 把购物车重新设置回缓存中
*/

/*
============商品数量的编辑===========
 1 "+""-"按钮 绑定同一个点击事件 区分的关键 自定义属性 "+  +1" "- -1"
 2 传递被点击的商品id goods_id
 3 获取到data中的购物车数组 来获取需要修改的商品对象
 4 直接修改商品对象的数量 num
    当购物车数量 =1 的同时 用户点击 -1 
     弹窗提示(wx.showModal)  询问用户是否要删除 1 确定 直接执行删除 2 取消什么都不做
 5 吧cart数组 重新设置回缓存中和data中 this.setCart
*/

/*
============点击结算===========
  1 判断有没有收货地址信息
  2 判断用户有没有选购商品
  3 经过以上验证 跳转到支付页面
*/
import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime"
 // noShow  
 // 1回到商品详情页面 第一次添加商品的时候 手动添加了属性
 // 1.1 num=1    1.2  checked = true
 // 2 获取缓存中的购物车数组 3 把购物车数组填充到tada中
Page({
  data:{
    address:{},
    cart:[],
    // 全选的实现 数据的展示
    // 1 noShow 获取缓存中的购物车数组
    // 2 根据购物车中的商品数据 所有的商品都被选中 checked=true 全选就被选中
    allChecked:false,
    totalPrice:0,
    totalNum:0,

  },
  onShow(){
    // 获取缓存中的收货信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数组
    const cart = wx.getStorageSync("cart")||[];

    this.setData({address})
    this.setCart(cart);
  },
  // 获取用户的收货地址
  // 1 点击收货地址事件
  //   1.1 调用小程序内置 api 获取用户的收货地址 wx.chooseAddress
  // 2 获取用户对于小程序所授予获取地址权限的状态 scope
  //   2.1 假设用户 点击获取收货地址的提示框是 确定(authSetting) scope.address的值为true 可以直接调用收货地址
  //   2.2 假设用户 用户从来没有调用过 收货地址的api scope的值为undefined 可以直接调用收货地址
  //   2.3 假设用户 点击获取收货地址的提示框是 取消 scope的值为false 不可以直接调用收货地址
  //     2.3.1 诱导用户自己打开授权设置页面(openSetting) 当用户重新授予获取地址权限的时候
  //     2.3.2 获取收货地址
//  async handleChooseAddress(){
//     // console.log("收货地址")
//     //获取权限状态
//     // wx.getSetting({
//     //   success: (result)=>{
//     //     //获取权限状态 只要发现一些属性名怪异的时候 都要使用[]形式来获取属性值
//     //     const scopeAddress = result.authSetting["scope.address"]
//     //     if(scopeAddress===true||scopeAddress===undefined){
//     //         wx.chooseAddress({
//     //           success: (result1)=>{
//     //             console.log(result1)
//     //           },
//     //         });
//     //     }else{
//     //       // 用户以前拒绝过授予权限 先诱导用户自己打开授权设置页面
//     //       wx.openSetting({
//     //         success: (result2)=>{
//     //           // 可以调用收货地址代码
//     //           wx.chooseAddress({
//     //             success: (result3)=>{
//     //               console.log(result3)
//     //             },
//     //           });
//     //         },
//     //       });
//     //     }
//     //   },
//     //   fail: ()=>{},
//     //   complete: ()=>{}
//     // });
  
//     // 获取权限状态
//   const res1 = await getSetting();
//   const scopeAddress = res1.authSetting["scope.address"];
//   // 判断权限状态  
//   if(scopeAddress===false){
//     await openSetting();   
//   }
//   // 调用获取收货地址的api
//   const res2=await chooseAddress();
//   console.log(res2)
  
  
    // 点击收货地址
     //页面加载完毕 onLoad onShow
  // 获取本地储存中的地址
  // 把数据设置给data中的一个变量 address
    async handleChooseAddress(){
    try {
      // 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 判断权限状态  
      if(scopeAddress===false){
        await openSetting();   
  }
      // 调用获取收货地址的api
      let address=await chooseAddress();
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
     // 把地址存入到缓存中
     wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error)
    }
  },
  // 商品的选中
  handeItmeChang(e){
    //获取被修改的商品id
    const goods_id=e.currentTarget.dataset.id
    // console.log(goods_id)
    // 获取购物车数组
    let {cart}=this.data;
    //找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    // 选中状态取反
    cart[index].checked=! cart[index].checked;

    this.setCart(cart);
   
  },
 // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买数量
  setCart(cart){
    let allChecked=true;
    //总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })
    // 判断数组是否为空
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart", cart);
  },
  //商品的全选功能
  handleItmeAllCheck(){
    //获取data中的数据
    let {cart,allChecked} = this.data;
    //修改值
    allChecked=!allChecked
    // 循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked)
    // 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },
 // 商品数量的编辑功能
 async handleItemNumEdit(e){
 // 1 获取事件传递过来的参数
 const {operation,id}=e.currentTarget.dataset;
  //  console.log(operation,id);
  // 获取购物车数组
  let {cart}=this.data;
  //找到需要修改的商品索引
  const index=cart.findIndex(v=>v.goods_id===id)
  // 判断是否要执行删除
  if(cart[index].num===1&&operation===-1){
    //弹窗提示
   const res=await showModal({content:"您是否要删除?"})
   if(res.confirm){
    // console.log("用户点击确定")
    cart.splice(index,1)
    this.setCart(cart)
  }
  }else{
    // 进行数量修改
   cart[index].num+=operation;
   // 设置回缓存和data中
   this.setCart(cart);
      }
 
 },
 // 点击结算
 async handlePay(){
  // 判断收货地址
  const {address,totalNum}=this.data;
  if(!address.userName){
    await showToast({title:"您还没有选择收货地址"})
    return;
  }
  // 判断用户有没有选购商品
  if(totalNum===0){
    await showToast({title:"您还没有选购商品"})
    return;
  }
  // 跳转到支付页面
  wx.navigateTo({
    url: '/pages/pay/pay',
  });
 },
})

