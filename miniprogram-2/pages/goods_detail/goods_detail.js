// pages/goods_detail/goods_detail.js
/**
   
   */
import{ request} from "../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
   goodsObj:{},
   //商品是否被收藏过
   isCollect:false
  },
  // 商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let Pages =  getCurrentPages();
    let currentPage=Pages[Pages.length-1]
    let options=currentPage.options
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);

  },
 // 获取商品详情数据
 getGoodsDetail(goods_id){
  request({url:'https://api-hmugo-web.itheima.net/api/public/v1/goods/detail',data:{goods_id}})
  .then(goodsObj=>{
    this.GoodsInfo=goodsObj; // 赋值
       // 获取缓存中的商品数组
   let collect=wx.getStorageSync("collect")||[]
   // 判断当前商品是否被收藏了
   let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id)
    // console.log(goodsObj.data.message)
    this.setData({
      goodsObj:{
       
        goods_name:goodsObj.data.message.goods_name,
        goods_price:goodsObj.data.message.goods_price,
        // iphoneg部分手机 不识别webp图片格式
        // 最好找到后台 让他进行修改(正常情况要让后台修改)
        // 也可以临时自己改 确保后台存在 1.webp=>1.jpg (用正则修改.replace(/\.webp/g,'.jpg'),)(这只是暂时在前端修改)
        goods_introduce:goodsObj.data.message.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.data.message.pics,
      },
      isCollect
    })
    })
 },
 // 点击轮播图 预览大图
 //  1 给轮播图绑定点击事件
 //  2 调用小程序的 api previewImage 
 handlePreviewImage(e){
  //  console.log("预览大图")
  // 1 先构造要预览的图片数组 写一个全局对象(商品对象 GoodsInfo)
  const urls = this.GoodsInfo.data.message.pics.map(v=>v.pics_mid);
  // 2 接收传递过来的图片url
  const current=e.currentTarget.dataset.url;
  wx.previewImage({
    current, // 当前显示图片的http链接
    urls // 需要预览的图片http链接列表
  })
 },

 //点击加入购物车
// 1 先绑定点击事件
handleCartAdd(){
  // 2 获取缓存中的购物车数据 数组格式
  let cart = wx.getStorageSync("cart")||[];
// 3 先判断 当前的商品是否存在于购物车中
  let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.data.message.goods_id)
  if(index===-1){
    //不存在 第一次添加
    this.GoodsInfo.data.message.num=1; 
    this.GoodsInfo.data.message.checked=true; 
    cart.push(this.GoodsInfo.data.message);
    // console.log(index)
  }else{
    // 4 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
    cart[index].num++;
    // console.log("已经存在")
  }
// 5 不存在与购物车的数组中 直接给购物车添加一个新元素 新元素带上购买数量属性num
  wx.setStorageSync("cart",cart)
// 6 弹出提示
wx.showToast({
  title: '加入成功',
  icon: 'success',
// true 防止用户手抖 疯狂点击按钮
  mask:true,
});
},

/*
======== 商品收藏=====
1 页面onshow的时候 加载缓存的商品收藏数据
2 判断当前商品是不是被收藏的
  1 改变页面图标
  2 不是 什么都不做
3 点击商品收藏按钮
  1 判断商品是否存在于缓存数组中
  2 已经存在 删除
  3 没有存在  把商品添加到收藏数组中 存入缓存
   */
// 点击商品点击图标
handleCollect(){
  let isCollect=false;
  //获取缓存中商品收藏数组
  let collect=wx.getStorageSync("collect")||[];
  // 判断商品是否存在于缓存数组中
  let index= collect.findIndex(v=>v.goods_id===this.GoodsInfo.data.message.goods_id)
 
  // 当 index !=-1 就表示 已经收藏过了
  if(index!==-1){
    
    // 能找到 已经收藏了 删除该商品
    collect.splice(index,1)
    isCollect=false;
    wx.showToast({
      title: '取消成功',
      icon:'success',
      mask:true,
    })
    
    
  }else{
   
    //没有收藏过
    collect.push(this.GoodsInfo.data.message);
    isCollect=true;
    wx.showToast({
      title: '收藏成功',
      icon:'success',
      mask:true,
    })
   
  }
  // 把数组存入缓存中
  wx.setStorageSync('collect', collect)
  // 修改data的属性 isCollect
  this.setData({
    isCollect
  })
}
})