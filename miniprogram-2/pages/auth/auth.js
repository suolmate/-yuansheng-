// pages/auth/auth.js
import {request} from "../../request/index"
import regeneratorRuntime from "../../lib/runtime/runtime"
import {login } from "../../utils/asyncWx.js"
Page({
 // 获取用户信息
//  async handleGetUserInfo(e){
//     try{
//       // console.log(e);
//     // 1 获取用户信息
//     const {encryptedData,rawData,iv,signature}=e.detail;
//     // 2 获取小程序登录成功后的code
//     const {code} = await login();
//     //  console.log(code);
//     const loginParams={encryptedData,rawData,iv,signature,code};
//     //3 发送请求 获取用户的token
//     const res=await request({url:"https://api-hmugo-web.itheima.net/api/public/v1/users/wxlogin",data:loginParams,method:"post"});
//     // console.log(res);
//     // 把token存入缓存中 同时转回上一个页面
//     wx-wx.setStorageSync('token', token);
//     wx-wx.navigateBack({
//       delta: 1,
//     })
//     }catch (error){
//       console.log(error);
      
//     }

   
//  }
//  获取用户信息

})