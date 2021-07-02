var q = require("../../utils/question.js"), n = "random", r = "exam", s = 1, app = getApp();
let md5 = require('../../utils/md5.js').md5;
var util = require('../../utils/util.js');
Page({

  data: {
    selectedresults: {},
    score: 0,
    StorageAll: {},
    indexInd: 0,
    redNum: 0,
    greenNum: 0,
    allNum: 0,
    intensify_qis: [],
    intensify_eids: [],
    intensify_okids: [],
    orderPX: {},
    idarr: [],
    textTab: "答题模式",
    selectInd: !0,

    iconcircle: [],
    recmend: !1,
    youind: 0,
    outside: !0,
    current: 0,
    questions: [],
    timeshow: !0,
    times: "",
    ytimes: "",
    danxuan: 0,
    duoxuan: 0,
    panduan: 0,
    allfen: 0,
    passf: 0,
    interval: 300,
    training_qids: "",
    training_jl: "",
    videoctrl: !0,
    videoMedia: "",
    startTime: 0,
    startTimeind: !1,
    nums: 0,
    testMode: !1
  },

  onLoad: function (t) {
    this.onGetOpenid();
    var that = this;
    var category = app.globalData.category;
    console.log(t.passf)
    let ordernum = t.ordernum;
    that.setData({
      ordernum,
      category : category,
      times: 1 * t.time + 1 + ":00",
      passf: t.passf,
      training_jl: t.training_qids,
      startTime: 1 * t.time,
      nums: t.nums
    });
    wx.setNavigationBarTitle({
      title: "答题助手"
    });
    that.timeServal(1 * t.time);
    this.onQuery(ordernum);
  },
  onQuery: function(ordernum){
    console.log('开始查询题库');
    let that = this;
    const db = wx.cloud.database();

    db.collection('historys')
    .doc(ordernum)
    .get()
    .then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let item = res.data;
      let questions = item.questions;
      // 只显示错题
      let newQuesItems = questions.filter(item => item.status == false);
      that.setData({
        questions: newQuesItems,
        ques: newQuesItems[0],
        nums: newQuesItems.length
      },()=>{
        console.log('已赋值完成')
      })
      
    })

  },
  onReady: function () {

  },
  previewImg: function(){
    var index = 0;
    var imgArr = this.data.ques.imgs;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {
        console.log(res)
      },
    })
  },
  onShow: function () {
 
  },

  

  selectAnswer: function(e){
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
      this.addNote(questions[current]);
    }
    let selectedresults = this.data.selectedresults;
    
    questions.map((q)=>{
      if(q._id == obj.id){
        q.selectedresult = obj;
      }
    })
    selectedresults[obj.id] = obj;
    
    let score = greenNum;
    this.setData({
      selectedresults,
      questions,
      greenNum,
      redNum,
      score
    },()=>{
      console.log('')
    })
    console.log(selectedresults);
    console.log(this.data.questions);

  },
  addNote: function(q){
    let that = this;

    const db = wx.cloud.database()
    db.collection('notes').add({
      data: {
        qid: q['_id'],
        question: q
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        // 在返回结果中会包含新创建的记录的 _id
        // wx.showToast({
        //   title: '新增记录成功',
        // })
        
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  pageChange: function(e) {
    console.log('bindchange');
    console.log(e);
    console.log(e.detail);

    if(e.detail.current+1 == this.data.nums){
      wx.showToast({
        icon: 'none',
        title: '已经是最后一题了'
      })
    }
    this.setData({
      allNum: e.detail.current+1,
      current: e.detail.current,
      ques: this.data.questions[e.detail.current]
    })
   

  },

  newUp_exam:function() {
    this.goHome();
  },
  goHome: function(){
    let url = '/pages/index/index';
    wx.switchTab({
      url: url
    })
  },
  changeTab:function() {
    var e = this,
    a = e.data.questions;
    e.setData({
      questions: a,
      textTab:"背题模式",
      selectInd: !1
    })
  },

  random: function () {
    var r = this;
    s = r.data.category.id;
    console.log(n + "" + s)
    wx.getStorage({
      key: n + "" + s,
      success: function (t) {
        console.log(t)
        r.setData({
          StorageAll: t.data
        });
        console.log(t.data)
      },
      complete: function () {
        var t = q.questionIds["questionId"]
        var question = q.questions["question"]
        var question_ids = r.getRandomArrayElements(t, 100)
        console.log(question_ids)
      }
    })
  },

  getRandomArrayElements(arr,count){
    var shuffled = arr.slice(0),
      i = arr.length,
      min = i - count,
      temp,index;
    while ( i-- > min){
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }

    return shuffled.slice(min);
  },

  timeServal: function (t) {
    console.log(t)
    if (0 != t) {
      var e = t,
        a = 59,
        n = this;
      setInterval(function () {
        a < 10 ? n.setData({
          times: e + ":0" + a,
          ytimes: t - e + ":" + (59 - a)
        }) : n.setData({
          times: e + ":" + a,
          ytimes: t - e + ":" + (59 - a)
        }), --a < 0 && (e > 0 ? (a = 59, e--) : (a = 0, e = 0, n.setData({
          startTimeind: !0
        })));
      }, 1e3);
    } else this.setData({
      times: 0,
      startTimeind: !0
    });
  },

  set_time: function () {
    var t = parseInt(this.data.times);
    0 == t && (t = 1), wx.setStorage({
      key: "time" + this.data.category.id,
      data: t
    }), wx.setStorage({
      key: "exam_allfen" + this.data.category.id,
      data: this.data.allfen
    });
  },

  result: function() {

    let that = this;

    const db = wx.cloud.database()
    db.collection('history').add({
      data: {
        questions: that.data.questions,
        userInfo: that.data.userInfo,
        categoryid: that.data.category._id,
        category: that.data.category,
        score: that.data.score
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        // 在返回结果中会包含新创建的记录的 _id        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })

    // wx.request({
    //   url: app.globalData.url + '/routine/auth_api/save_result?uid=' + uid,
    //   method: 'post',
    //   dataType: 'json',
    //   data: { 'uid': uid, 'score': this.data.greenNum, 'category': this.data.category.id,'usetime':this.data.ytimes},
    //   success: function (res) {
    //     console.log(res)
    //   }
    // })

    wx.redirectTo({
      url: "../examresult/examresult?greenNum=" + this.data.greenNum + "&redNum=" + this.data.redNum + "&allNum=" + this.data.allNum + "&ytimes=" + this.data.ytimes + "&allfen=" + this.data.allfen + "&passf=" + this.data.passf + "&allQuestionCount=" + this.data.questions.length,
    })
  },

  onUnload: function () {
    this.set_time();
  },

  onHide: function () {
    this.set_time();
  },

  onGetOpenid: function() {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login]: ', res)
        that.setData({
          openid: res.result.openid
        })
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
  }
})