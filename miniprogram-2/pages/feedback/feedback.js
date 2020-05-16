// pages/feedback/feedback.js

  /**
   1 点击+ 触发tap点击事件
   2获取到图片的路径 数组
   3 吧图片路径存到data变量中
   4页面就可以根据图片数组 进行循环显示 自定义组件
 2 点击自定义图片组件
  获取被点击的元素索引
  获取data中的图片数组
  根据索引 数组中删除对应的元素  
  把数组重新设置回data中
 3 点击提交 
  1 获取文本域的内容 类似 输入框的获取
    1.1 data中定义变量 表示 输入框内容
    1.2 文本域中定义变量 表示 输入框的内容
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片服务器 返回图片外网的连接
    3.1 遍历数组
    3.2 挨个上传
    3.3 自己维护图片数组 存放 图片上传后的外网链接
  4 文本域 和外网的图片的路径 一起提交到服务器(前端模拟 不会发生请求到后台)
  5 清空当前页面
  6 返回上一页
   */
Page({
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品,商家投诉",
        isActive:false
      },
    ],
  // 被选中的图片路径数组
   chooseImgs:[],
   // 文本域的内容
   textval:""
  },
  // 外网的图片的路径数组
  UploadImgs:[],
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
  // 点击+ 选择图片
  handleChooseImg(){
  // 2调用小程序内置的选择图片api
  wx.chooseImage({
    count: 9,
    sizeType: ['original','compressed'],
    sourceType: ['album','camera'],
    success: (result)=>{
      // console.log(result);
      this.setData({
        // 图片数组 进行拼接 方便用户 多次选择
        chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
      })
    }
  });
  },
  // 点击自定义图片组件
  handleRemoveImg(e){
    // 获取被点击的组件索引
    const {index}=e.currentTarget.dataset
    console.log(index);
    // 获取data中的图片数组
    let {chooseImgs}=this.data;
    //删除元素
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })

  },
  //文本域的输入事件
  handleTxetInput(e){
    this.setData({
      textval:e.detail.value
    })
  },
  //提交按钮点击事件
  handleFormSubmit(){
    // 1 获取文本域的内容 图片数组
    const {textval,chooseImgs}=this.data;
    // 2 合法性的验证
    if(!textval.trim()){
      // 不合法的
      wx.showToast({
        title:"输入不合法",
        icon:"none",
        mask:true
      });
      return;
    }
    // 3 准备上传图片 到专门的图片服务器
    //上传文件的api不支持多个文件同时上传到的 遍历数组 挨个上传
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });

    // 判断有没有需要上传的图片数组

    if(chooseImgs.length!=0){
       chooseImgs.forEach((v,i)=>{
       wx.uploadFile({
      //图片要上传到哪里
      url:"https://img.coolcr.cn/index/api.html",
      //被上传的文件路径
      filePath:v,
      // 上传的文件名称 后台来获取文件 file
      name:"image",
      // 顺带的文本信息
      formData:{},
      success:(result)=>{
        // console.log(result);
        let url=JSON.parse(result.data).url ;
        this.UploadImgs.push(url)
        console.log(this.UploadImgs);
        // 所有的图片都上传完毕才触发
        if(i===chooseImgs.length-1){
          // 弹窗关闭
          wx.hideLoading();
          console.log("把文本的内容河外网的图片数组 提交到后台中");
          // 提交都成功了 
          //重置页面
          this.setData({
            textval:"",
            chooseImgs:[]
          })
          //返回上一个页面
          wx.wx.navigateBack({
            delta: 1
          });
        }
      }

    })
    })
    }else{
      wx.hideLoading();
      console.log("只提交文本");
    wx.navigateBack({
      delta: 1
    });
    }



   
  }
})