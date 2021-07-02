var t = require("../../utils/question.js"),
  e = [],
  a = "",
  r = "",
  s = "";
var app = getApp();  
Page({

  data: {
    selectedresults: {},
    StorageAll: {},
    orderPX: {},
    redNum: 0,
    greenNum: 0,
    allNum: 0,
    iconInd: !1,
    iconIndtwo: !1,
    indexInd: 0,
    current: 0,
    textTab: "答题模式",
    selectInd: !0,
    testMode: !1,
    everyDay_all: 0,
    xiejie: false,
    interval: 300,
    everyDay_error: 0,
    everyDay_all: 0,
    mode: "1",
    idarr: [],
    questions: [],
    iconcircle: [],
    collectData: [],
    starshow: !0,
    del_chapter_id:'all',
    delarr: []
  },

  onLoad: function (options) {
    console.log(options);
    console.log(options.navtitle)
    var category = app.globalData.category;
    let that = this;
    
    wx.setNavigationBarTitle({
      title: options.title
    });
    this.onGetOpenid(options.mode);
  },
  onQuery: function(openid,mode){
    switch(mode){
      case '1':
        console.log('错题');
        this.onQueryNotes(openid)
        break;
      case '2':
        console.log('收藏');
        this.onQueryFavor(openid)
        break;
      default:
        console.log('其他异常情况');
    }
    
  },
  onQueryNotes: function(openid){
    let that = this;

    const db = wx.cloud.database()
    db.collection('notes').where({
      _openid: openid
    }).get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.data;
      let questions = [];
      let arr = [];
      items.map((it)=>{
        arr.push(it.qid);
      })
      items.map((it)=>{
        if(arr.indexOf(it._id) == -1){
          questions.push(it.question);
        }
      })
 
      that.setData({
        questions,
        nums: questions.length
      });
    })
  },
  onQueryFavor: function(openid){
    let that = this;

    const db = wx.cloud.database()
    db.collection('favor').where({
      _openid: openid
    }).get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.data;
      let questions = [];
      let arr = [];
      items.map((it)=>{
        arr.push(it.qid);
      })
      items.map((it)=>{
        if(arr.indexOf(it._id) == -1){
          questions.push(it.question);
        }
      })
 
      that.setData({
        questions,
        nums: questions.length
      });
    })
  },
  onReady: function () {

  },

  onShow: function () {

  },

  getthree: function () {
    var t = this,
      e = {
        currentTarget: {
          dataset: {
            index: 0
          }
        }
      };
    t.jumpToQuestion(e);
  },

  changeTab: function (t) {
    var e = this;
    console.log(t.currentTarget.dataset.texttab);
    var a = e.data.questions;
    e.setData({
      questions: a,
      textTab: t.currentTarget.dataset.texttab,
      selectInd: "答题模式" == t.currentTarget.dataset.texttab
    });
  },

  jumpToQuestion: function (t) {
    var a = this,
      r = a.data.orderPX;
    for (var n in r) "blue" == r[n] && (r[n] = "");
    this.setData({
      orderPX: r,
      iconInd: !1,
      iconIndtwo: !1
    });
    var d = t.currentTarget.dataset.color;
    if ("red" != d && "green" != d) {
      var i = a.data.orderPX;
      i[t.currentTarget.dataset.id] = "blue", a.setData({
        orderPX: i
      });
    }
    console.log(a.data.orderPX)
    var s = t.currentTarget.dataset.index;
    a.data.indexInd = s;
    var o = [];
    1 == this.data.current ? (a.data.indexInd <= 0 ? o.push(e[e.length - 1]) : o.push(e[a.data.indexInd - 1]),
      o.push(e[a.data.indexInd]), a.data.indexInd >= e.length - 1 ? o.push(e[0]) : o.push(e[e.length - 1])) : 0 == this.data.current ? (o.push(e[a.data.indexInd]),
        a.data.indexInd == e.length - 1 ? (o.push(e[0]), o.push(e[1])) : a.data.indexInd == e.length - 2 ? (o.push(e[a.data.indexInd + 1]),
          o.push(e[0])) : (o.push(e[a.data.indexInd + 1]), o.push(e[a.data.indexInd + 2]))) : (0 == a.data.indexInd ? (o.push(e[e.length - 2]),
            o.push(e[e.length - 1])) : 1 == a.data.indexInd ? (o.push(e[e.length - 1]), o.push(e[0])) : (o.push(e[a.data.indexInd - 2]),
              o.push(e[a.data.indexInd - 1])), o.push(e[a.data.indexInd])), this.setData({
                questions: o,
                indexInd: s
      }), this.infoshow(e[s].question_id)
  },

  _updown: function () {
    this.setData({
      iconInd: !this.data.iconInd,
      iconIndtwo: !this.data.iconIndtwo,
    })
  },

  starcollect: function() {
    this.setData({
      starshow: !this.data.starshow
    });
    var t = this.data.delarr, e = this.data.idarr;
    this.data.starshow ? t.indexOf(e[this.data.indexInd]) > -1 && t.splice(t.indexOf(e[this.data.indexInd]), 1) : t.push(e[this.data.indexInd]),
    this.setData({
      delarr: t
    }), wx.setStorage({
      key: "delstar" + this.data.category.id,
      data: t
    });
  },

  infoshow: function (t) {
    this.data.delarr.indexOf(t) > -1 ? this.setData({
      starshow: !1
    }) : this.setData({
      starshow: !0
    });
  },

  del_data: function() {
    var t = this;
    console.log(this.data.del_chapter_id);
    var e = wx.getStorageInfoSync("errorids" + s),
      a = [];
    e && (0 == e.length || "all" == this.data.del_chapter_id ? (wx.setStorage({
      key: "errorids" + s,
      data: [],
    }), wx.navigateBack({
      delta: 1
    })) : (e.forEach(function(e, r) {
      Object.keys(e)[0] != t.data.del_chapter_id && a.push(e);
    }), wx.setStorage({
      key: "errorids" + s,
      data: a
    }), wx.navigateBack({
      delta: 1
    })));
  },
  selectAnswer: function (e) {
    console.log('选择题目');
    console.log(e);
    console.log(e.currentTarget)
    console.log(e.currentTarget.dataset);
    let obj = e.currentTarget.dataset;
    let questions = this.data.questions;
    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    let current = this.data.current;

    let flag = false;
    questions.map((q)=>{
      if(q._id == obj.id && q.selectedresult){
        flag = true;
      }
    })
    if(flag){
      return;
    }

    obj['val'] = 0;


    let answer = obj.answer;
    let selectedcode = obj.selectedcode;
    if(selectedcode == answer){
      obj['val'] = 1;
      greenNum++;
      
    }else{
      redNum++;
    }
    let selectedresults = this.data.selectedresults;
    
    questions.map((q)=>{
      if(q._id == obj.id){
        q.selectedresult = obj;
      }
    })
    selectedresults[obj.id] = obj;
    
    this.setData({
      selectedresults,
      questions,
      greenNum,
      redNum
    },()=>{
      console.log('')
    })
    console.log(selectedresults);
    console.log(this.data.questions);
  },

  selectAnswerMore: function(t){
    var e = this;
    if ("背题模式" != e.data.textTab && "1" != e.data.questions[e.data.current].order.subup) {
      var r = e.data.StorageAll, n = e.data.moreArr;
      n[t.currentTarget.dataset.ind] ? n[t.currentTarget.dataset.ind] = !1 : n[t.currentTarget.dataset.ind] = !0,
        r[t.currentTarget.dataset.id] = {
          subup: 0,
          down: n
        }, e.setData({
          moreArr: n
        }), wx.setStorage({
          key: a + "" + this.data.category.id,
          data: r
        }), wx.getStorage({
          key: a + "" + this.data.category.id,
          success: function (t) {
            e.setData({
              StorageAll: t.data
            });
          }
        });
      var d = e.data.questions;
      d[e.data.current].textTab = e.data.textTab, d[e.data.current].order = r[t.currentTarget.dataset.id],
        e.setData({
          questions: d
        });
    }
  },

  moreSelectSub: function (t) {
    function r() {
      if (i = n.data.idarr[d], d < n.data.idarr.length - 1) {
        if ("green" != n.data.orderPX[i] && "red" != n.data.orderPX[i]) {
          wx.setStorage({
            key: a + "ind" + n.data.category.id,
            data: d
          });
          var t = n.data.orderPX;
          for (var e in t) "blue" == t[e] && (t[e] = "");
          return t[i] = "blue", n.setData({
            orderPX: t
          }), void console.log(n.data.orderPX);
        }
        d++ , r();
      } else wx.setStorage({
        key: a + "ind" + n.data.category.id,
        data: n.data.idarr.length - 1
      });
    }
    var n = this, d = n.data.indexInd + 1, i = n.data.idarr[d];
    r();
    var s = n.data.StorageAll, o = n.data.moreArr;
    s[t.currentTarget.dataset.id] = {
      subup: 1,
      down: o
    }, console.log(s[t.currentTarget.dataset.id]), n.setData({
      StorageAll: s
    }), wx.setStorage({
      key: a + "" + n.data.category.id,
      data: s
    });
    var u = n.data.questions, c = e;
    c[n.data.indexInd].textTab = n.data.textTab, c[n.data.indexInd].order = {
      subup: 1,
      down: o
    }, u[n.data.current].textTab = n.data.textTab, u[n.data.current].order = {
      subup: 1,
      down: o
    }, e = c, n.setData({
      questions: u
    });
    var l = 0;
    for (var g in n.data.moreArr) n.data.moreArr[g] && l++;
    var h = n.data.allNum;
    if (h++ , l == t.currentTarget.dataset.answer.length) {
      (x = n.data.orderPX)[t.currentTarget.dataset.id] = "green", x.all = h, wx.setStorage({
        key: a + "list" + n.data.category.id,
        data: x
      });
      var p = n.data.greenNum;
      p++ , n.setData({
        greenNum: p
      }), n.questionStatus(), n.data.indexInd < e.length - 1 && n.autoPlay();
    } else {
      var x = n.data.orderPX;
      x[t.currentTarget.dataset.id] = "red", x.all = h, wx.setStorage({
        key: a + "list" + n.data.category.id,
        data: x
      });
      var f = n.data.redNum;
      f++ , n.setData({
        redNum: f
      }), n.questionStatus();
    }
    n.setData({
      moreArr: {
        A: !1,
        B: !1,
        C: !1,
        D: !1
      }
    });
  },

  questionStatus: function () {
    var t = this;
    wx.getStorage({
      key: a + "list" + s,
      success: function (e) {
        t.setData({
          orderPX: e.data,
          allNum: e.data.all
        });
      }
    });
  },

  delCollect: function () {
    console.log(this.data.collectData)
    var t = this.data.idarr, a = this.data.greenNum, n = this.data.redNum;
    console.log(this.data.orderPX[t[this.data.indexInd]]);
    "red" == this.data.orderPX[t[this.data.indexInd]] ? n-- : "green" == this.data.orderPX[t[this.data.indexInd]] && a--;
    for (var d = this.data.collectData, i = 0; i < d.length; i++) if (d[i][Object.keys(d[i]).toString()].indexOf(t[this.data.indexInd]) > -1) {
      var s = d[i][Object.keys(d[i]).toString()].indexOf(t[this.data.indexInd]);
      d[i][Object.keys(d[i]).toString()].splice(s, 1), 0 == d[i][Object.keys(d[i]).toString()].length && d.splice(i, 1);
    }
    
    "我的收藏" == r ? wx.setStorage({
      key: "starids" + this.data.category.id,
      data: d
    }) : wx.setStorage({
        key: "errorids" + this.data.category.id,
      data: d,
    }), e.splice(this.data.indexInd, 1), t.splice(this.data.indexInd, 1);

    var o = this.data.questions;
    o.splice(this.data.current, 1), this.setData({
      idarr: t,
      question: o,
      iconcircle: [{
        title: "",
        question_ids: t,
        len: 0
      }],
      greenNum: a,
      redNum: n
    }), 0 != this.data.indexInd && this.setData({
      indexInd: this.data.indexInd - 1
    }), 2 == e.length && this.setData({
      current: 1
    }), this.pageChange({
      detail: {
        current: this.data.current
      }
    }), 0 == e.length && wx.navigateBack({
      delta: 1
    });
  },

  autoPlay: function () {
    console.log('auto')
    this.setData({
      autoplay: !0
    })
  },
  pageChange: function(e) {
    console.log('bindchange');
    console.log(e);
    console.log(e.detail);
    this.setData({
      current: e.detail.current
    })
   

  },
  touchstart: function (t) { },
  bindtouchmove: function (t) { },
  bindtouchend: function (t) { },
  scrolltop: function (t) { },
  onGetOpenid: function(mode) {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        that.setData({
          openid: res.result.openid
        })
        that.onQuery(res.result.openid,mode)
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
})