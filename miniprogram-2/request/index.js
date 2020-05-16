//同时发送异步代码的次数
let ajaxTimes = 0;

export const request=(params)=>{
  // 判断url中是否带有/my/ 这个字符串 如有 请求就是私有的路径 带上 header token
  let header={...params.header};
  if(params.url.includes("/my/")){
    // 拼接herder 带上token
    header["Authorization"]=wx.getStorageSync("token");
  }

  ajaxTimes++;
  //显示加载中的效果
  wx.showLoading({
    title:'加载中',
    mask:true
   });
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header:header,
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        resolve(err)
      },
      complete:()=>{
        ajaxTimes--;
        if(ajaxTimes===0){
        //关闭等待图标
        wx.hideLoading();
        }
      }
    });
  })
}