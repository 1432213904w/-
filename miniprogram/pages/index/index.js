//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    questionnum:0,
    afternum:0,
    ctNum:0,
    admin: false
  },
  onLoad: function () {
    console.log('onLoad');
    this.onGetOpenid();
    this.onQuery();
    // this.onQueryAdmin();
  },
  onQueryAdmin: function() {
    let that = this;

    const db = wx.cloud.database()
    db.collection('admin').doc('d782d4875f7dcf9c00fbb6bc274325f4')
    .get().then(res => {
      // res.data 包含该记录的数据
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.data.items;
      let admin = this.data.admin;
      if(items.indexOf(app.globalData.openid) != -1){
        admin = true;
      }
      this.setData({
        admin
      })

    })
  },
  onQuery: function(storageCate) {
    let that = this;

    const db = wx.cloud.database()
    db.collection('invite').get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res);
      let arr = res.data;
      let selectedItems = [];
      if(arr.length){
        arr.forEach(element => {
          if(element.items){
            selectedItems = selectedItems.concat(element.items)
          }
        });
      }

      console.log('selectedItems',selectedItems)
      if(selectedItems.length == 0){
        selectedItems.push('001');
        selectedItems.push('002');
      }
      app.globalData.selectedItems = selectedItems;
      
    })
  },
  toInvite: function(){
    wx.navigateTo({
      url: '../select/select',
    })
  },
  onGetData: function() {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'getData',
      data: {

      }
    })
    .then(res => {
      console.log('[云函数] [getData]: ', res)
      let category = res.result.data;
      app.globalData.category = category;
      this.setData({
        category
      })
    
      
    }).catch(err => {
      console.error('[云函数] [getData] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },
  onShow:function(){
    let that = this;
    this.onGetData();

    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  
  myQuestion: function () {
    wx.navigateTo({
      url: "../course/course?isFirst=0"
    });
  },
  myQrcode: function () {
    wx.navigateTo({
      url: "../qrcode/qrcode"
    });
  },
  orderGo: function (e) {
    console.log(e.currentTarget.dataset);
    let mode = e.currentTarget.dataset.mode;
    switch(mode){
      case '1':
        wx.navigateTo({
          url: "../sorthome/sorthome"
        })
        break;
      case '2':
        wx.navigateTo({
          url: "../randomhome/randomhome"
        })
        break;
      default:
        console.log('其他未匹配mode='+mode)
    }
    
  },
  aboutGo: function(){
    let url = '/pages/about/about';
    wx.navigateTo({
      url: url
    })
  },

  historyGo: function(){
    let url = '/pages/history/history';
    wx.navigateTo({
      url: url
    })
  },
  defaultGo:function(e){
    console.log(e.currentTarget.dataset);
    let mode = e.currentTarget.dataset.mode;

    switch(mode){
      case '0':
        wx.navigateTo({
          url: "../list/list?mode=0"
        })
        break;
      case '1':
        wx.navigateTo({
          url: "../list/list?mode=1"
        })
        break;
      default:
        console.log('其他未匹配mode='+mode)
    }
    return;
    switch(mode){
      case '0':
        wx.navigateTo({
          url: "../errorpage/errorpage"
        })
        break;
      case '1':
        wx.navigateTo({
          url: "../collecpage/collecpage"
        })
        break;
      default:
        console.log('其他未匹配mode='+mode)
    }

  },
  examGo: function () {
    if(app.globalData.auth == 0){
      wx.navigateTo({
        url: '../auth/auth'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/examhome/examhome?pid='+app.globalData.category._id
    })

    // wx.navigateTo({
    //   url: '/pages/someinfo/someinfo'
    // })
    
  },
  gradeGo: function () {
    setTimeout(function () {
      wx.navigateTo({
        url: "/pages/grade/grade"
      });
    }, 30);
  },
  rankGo: function () {
    setTimeout(function () {
      wx.navigateTo({
        url: "/pages/rank/rank"
      });
    }, 30);
  },
  ruleGo: function () {
    setTimeout(function () {
      wx.navigateTo({
        url: "/pages/rule/rule"
      });
    }, 30);
  },
  getCategory: function(){
    return new Promise(function (resolve, reject) {
      resolve(app.globalData.category)
    }).catch(res=>{
      console.log('catch',res)
    });
  },
  onGetOpenid: function() {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {

      }
    })
    .then(res => {
      console.log('[云函数] [login]: ', res)
      let openid = res.result.openid;
      app.globalData.openid = openid;
      that.setData({
        openid:openid
      },async ()=>{
        const db = wx.cloud.database();
        const res = await db.collection('profiles').where({
          _openid: openid
        }).count();

        // const res2 = await db.collection('invite').where({
        //   _openid: openid
        // }).count();

        // console.log(res2);
        // if(res2.total==0){
        //   let url = '../new/new';
        //   wx.redirectTo({
        //     url: url
        //   })
        // }

        that.setData({
          total: res.total
        })
        console.log(res);
        if(res.total == 0){
          that.addProfile();
        }

        if(res.total > 0){
          that.queryProfile(openid);
        }
      });
      
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },
  addProfile: function(){
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('profiles').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _id: this.data.openid,
        userInfo: app.globalData.userInfo,
        category: app.globalData.category,
        time: new Date(),
        auth: 0
      }
    })
    .then(res => {
      app.globalData.auth = 0;
      console.log(res)
      console.log('[数据库] [查询记录] 成功: ', res);
    })
    .catch((err)=>{
      console.log(err)
    })
  },
  queryProfile: function(openid){
    let that = this;
    const db = wx.cloud.database()
    db.collection('profiles')
    .doc(openid)
    .get()
    .then((res)=>{
      console.log('[数据库] [查询记录] 成功: ', res);
      let {auth,userInfo,category}= res.data;
      this.setData({
        category,
        userInfo: res.data.userInfo
      })
      app.globalData.auth = auth;
      app.globalData.category = category;
      app.globalData.userInfo = userInfo
    })
    .catch((err)=>{
      console.log(err)
      console.error('[数据库] [查询记录] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: "这份考题咋这么难，不信你看！",
      path: "pages/index/index",
      imageUrl: "https://7765-weixinquestion-4ltg8-1301202106.tcb.qcloud.la/img2020102008.jpg?sign=22d70677f3e57411a2c93e62c272369a&t=1603293653"
    };
  }
})
