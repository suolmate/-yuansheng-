// pages/search/search.js

  /**
  1 给输入框绑定 值改变事件 input事件
    1.1 获取到输入框的值
    1.2 合法性判断
    1.3 检验通过 把输入框的值发送到后台
    1.4 返回的数据打印到页面上
  2 防抖 定时器 节流   
   防抖一般用作输入框中的 防止重复输入 重复发送请求
   节流的话 一般用在页面下拉和上啦
    2.1 定义一个全局的定时器id
   */
  import{ request} from "../../request/index.js";
  import regeneratorRuntime from "../../lib/runtime/runtime"
Page({
  data: {
    goods:[],
    // 取消按钮是否显示
    isFocus:false,
    //输入框的值
    inpValue:""
  },
  TimeID:-1,
  // 输入框的值改变 就会触发
  handleInput(e){
    // console.log(e);
    // 1 获取输入框的值
    const {value}=e.detail
    // 2 检测合法性
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      //值不合法
      return;
    }
    //  3 准备发送请求获取数据
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeID);
    this.TimeID=setTimeout(()=>{
      this.qsearch(value);
    })
    this.qsearch(value);
  },
  // 发送请求获取搜索建议 数据
 async qsearch(query){
      const res=await request({url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/qsearch",data:{query}})
      // console.log(res.data.message);
      this.setData({
        goods:res.data.message
      })
    },
    //点击取消按钮
    handleCancel(){
      this.setData({
        inpValue:"",
        isFocus:false,
        goods:[]
      })
    }
})