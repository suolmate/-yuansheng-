// pages/login/login.js
Page({
  data: {

  },
  handleGetUserInfo(e){
    // console.log(e);
    const {userInfo} = e.detail
    wx.setStorageSync("userInfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  },

})