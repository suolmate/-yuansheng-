// pages/categpry/categpry.js
import {request} from "../../request/index.js";
Page({
  data: {
  //左侧的商品数据
    leftMenuList:[],
  //右侧的商品数据
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    // 右侧内容滚动条距离顶部的距离
    scrllTop:0
  },
  // 接口的返回数据
   Cates:[],


  onLoad: function (options) {
    //1 先判断本地储存有没有旧的数据
    // { time:Date.now(),data:[....]}
    //2 没有旧数据 直接发送新请求
    //3 有旧数据 且没有过期 就使用本地储存旧数据 
//============================================    
      // 1 获取本地储存中的数据
    const Cates= wx.getStorageSync("cates");
     // 2 判断
    if(!Cates) {
      //不存在旧数据 发送请求 获取数据
      this.getCates();
    }else{
      // 有旧数据 暂时定义一个过期时间10s  在改成5min
      if(Date.now()-Cates.time>1000*500){
        //重新发送请求
        this.getCates();
      }else{
        //可以使用旧的数据
        // console.log("可以使用旧的数据")
        this.Cates=Cates.data;

      let leftMenuList=this.Cates.map(v=>v.cat_name);
      let rightContent=this.Cates[0].children;
      this.setData({
       leftMenuList,
       rightContent
     })
      }
    }


    // this.getCates();
  },
  // 获取分类数据
   getCates(){
    request({
      url:"https://api-hmugo-web.itheima.net/api/public/v1/categories"
    }).then(res=>{
      this.Cates=res.data.message; 
      // 把接口数据存入本地储存中
      wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

      // 构造左侧大菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
       // 构造右侧商品数据
       let rightContent=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e){
    // console.log(e)
    // 1 获取被点击标题身上的索引 
    // 2 给data中的currentIndex赋值
    // 3 根据不同的索引渲染右侧的商品内容
    const{index}=e.currentTarget.dataset;
    
    let rightContent=this.Cates[index].children;
      this.setData({
        currentIndex:index,
        rightContent,
         //重新设置右侧内容的scroll-view标签距离顶部的距离
        scrllTop:0
      })
     

  }
})