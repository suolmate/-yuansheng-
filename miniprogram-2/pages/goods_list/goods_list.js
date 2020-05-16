// pages/index/goods_list/goods_list.js
import{ request} from "../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      },
    ],
   goodsList:[],
  },
  
  // 接口要的参数
  QuerParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,
  onLoad: function (options) {
  // console.log(options)
  this.QuerParams.cid = options.cid||"";
  this.QuerParams.query = options.query||"";
  this.getGoodsList();
  },


  // 获取商品列表数据
  getGoodsList(){
    request({url:'https://api-hmugo-web.itheima.net/api/public/v1/goods/search',data:this.QuerParams})
    .then(res=>{
      // console.log(res.data.message.total)
      // const total=res.total
      const total= res.data.message.total
      this.totalPages=Math.ceil(total/this.QuerParams.pagesize)
      // console.log(this.totalPages);
      this.setData({
        // goodList:res.data.message.goods
        // 拼接的数组
        goodsList:[...this.data.goodsList,...res.data.message.goods] 
      })
      // 关闭下拉刷新的窗口
      wx.stopPullDownRefresh();
      })
     
  },
 // 标题的点击事件 从子组件传递过来的
  handTabsItemChange(e){
    // console.log(e)
    // 1 获取被点击的标题索引
    const{index} = e.detail;
    // 2 修改源数据
    let {tabs} = this.data;
    // v是循环项 i是索引
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },

// 1用户上滑页面 滚动条触底 开始加载下一页数据 
// 1-1 找到滚动条触底事件 
// 1-2 判断有没有下一页数据 
//    1-2-1 获取到总页数 
//       1-2-1-1 如果只有总条数  总页数 = Math.ceil(总条数 / 页容量pagesize) 
//    1-2-2 获取到当前的页码 pagenum
//    1-2-3 判断当前页码是否大于或者等于总页数 那么就表示没有下一页数据
// 1-3 假如没有下一页数据 弹出一个提示 假如还有 继续加载下一页
//    1-3-1 当前页码++
//    1-3-2 重新发送请求
//    1-3-3 数据请求回来 要对data的数组进行 拼接 而不是全部替换
// 页面上滑 滚动条触底事件
 onReachBottom(){
  // console.log("页面触底了")
  // 1 判断还有没有下一页数据
  if(this.QuerParams.pagenum>=this.totalPages){
    // 没有下一页数据
    console.log("没有下一页")
    wx.showToast({title: '到底了', });
  }else{
    // console.log("还有下一页")
    this.QuerParams.pagenum++;
    this.getGoodsList();
  }
 },

 // 下拉刷新页面
 // 1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项(enablePullDownRefresh)
 // 1.1 找到触发下拉刷新的事件
 // 2 重置 数据 数组
 // 3 重置页码 设置为1
 // 4 重新发送请求
 // 5 数据请求回来 手动关闭等待效果
//=========================================
 //下拉事件刷新
 onPullDownRefresh(){
  //  console.log("刷新")
  // 重置数组
  this.setData({
    goodsList:[]
  })
  //重置页码
  this.QuerParams.pagenum = 1;
  // 发送请求
  this.getGoodsList();
 }
})

