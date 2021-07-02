// pages/someinfo/someinfo.js
var app = getApp();
Page({

  data: {

  },

  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      pid: options.pid,
      passf: options.passf,
      num: options.num,
      time: options.time
    })
  },


  onShow: function () {

  },

  someinfo:function(e){
    var that = this;
    let params = e.detail.value
    if (params.company == '' || params.department == '' || params.realname == ''|| params.tel == '') {
      wx.showToast({
        title: '请填写完整',
        icon: 'loading'
      })
      return false
    }
    let o1 = {};
    let o2 = app.globalData.userInfo;
    let o3 = {
      company: params.company,
      department: params.department,
      realname: params.realname,
      tel: params.tel
    }
    let userInfo = Object.assign(o1, o2, o3);
    app.globalData.userInfo = userInfo;

    // wx.navigateTo({
    //   url: '/pages/examhome/examhome'
    // })
    wx.navigateTo({
      url: "../exam/exam?pid="+this.data.pid+"&passf=" + this.data.passf + "&num=" + this.data.num + "&time=" + this.data.time
    });
  }
})