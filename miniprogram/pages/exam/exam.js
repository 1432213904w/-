let app = getApp();
let md5 = require('../../utils/md5.js').md5;
var util = require('../../utils/util.js');
Page({

  data: {
    showModal: true,
    showJiaoJuan: false,
    currentIndex: 0,
    md5: '',
    score: 0,
    indexInd: 0,
    redNum: 0,
    greenNum: 0,
    allNum: 0,
    current: 0,
    questions: [],
    times: "",
    ytimes: "",
    allfen: 0,
    passf: 0,
    interval: 300,
    nums: 0
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.onGetUUID();
    
    this.setData({
        pid: options.pid,
        times: 1 * options.time + 1 + ":00",
        passf: options.passf,
        examNum: options.num
      },()=>{
        this.onQueryCategory();
        console.log(app.globalData);
        switch(''+app.globalData.exam){
          case '0':
            this.onQueryQuestion();
            break;
          case '1':
            let questions = app.globalData.items;
            let num = app.globalData.num;
            let redNum = 0;
            let greenNum = 0;
            questions.forEach(ques=>{
              if(ques.selected && ques.status){
                greenNum++
              }
              if(ques.selected && ques.status == false){
                redNum++
              }
            })

            let nums = questions.length;
            let showJiaoJuan = this.data.showJiaoJuan;
            if(num+1 == nums){
              showJiaoJuan = true;
            }
            this.setData({
              currentIndex: num,
              current: num,
              greenNum,
              redNum,
              questions,
              nums: questions.length,
              showJiaoJuan
            },()=>{
              wx.hideLoading()
            });
            break;
          case '2':
            this.onQueryQuestion();
            break;
          default:
            console.log('其他未匹配情况')
        }
      });
   
    
    this.onGetOpenid();


    this.timeServal(1 * options.time - 1);
  },
  onQueryQuestion: function(){
    let that = this;

    // 在小程序代码中：
    wx.cloud.callFunction({
      name: 'fetchQues',
      data: {
        category: this.data.pid,
        num: app.globalData.quesTotal
      },
      complete: res => {
        console.log('callFunction fetchQues result: ', res);
        let items = res.result.list;
        let arr = [];
        let questions = [];
        items.map((item,idx)=>{
          console.log(idx);
          console.log(item);
          arr.push(item._id);
          
          let options = item.options;
          options.forEach((o)=>{
            o.selected = false;
            o.text = '';
          })
          item.index = idx;
          item.selected = false;
          item.status = false;
          item.options = options;
          questions.push(item);
        })
        that.setData({
          questions,
          arr: arr,
          md5: md5(arr.join()),
          nums: arr.length
        },()=>{
          console.log('已赋值完成')
          wx.hideLoading()
          this.updateMemory();
        })
      },
    })
  },
  updateMemory: function(){

    let id = app.globalData.openid+this.data.pid;
    let items = this.data.questions;
    let num = this.data.currentIndex + 1;
    let status = 1;

    const db = wx.cloud.database();
    db.collection('memory').doc(id).update({
      // data 传入需要局部更新的数据
      data: {
        items,
        num,
        status
      }
    })
    .then(res=>{
      console.log('[数据库] [更新记录] 成功: ', res)
      wx.hideLoading() 
    })
    .catch(err=>{
      console.log(err);
      wx.hideLoading() 
    })
  },
  updateMemory2: function(){

    let id = app.globalData.openid+this.data.pid;

    const db = wx.cloud.database();
    db.collection('memory').doc(id).update({
      // data 传入需要局部更新的数据
      data: {
        items: [],
        num: 0,
        status: 0
      }
    })
    .then(res=>{
      console.log('[数据库] [更新记录] 成功: ', res)
    })
    .catch(err=>{
      console.log(err);
    })
  },
  generate: function(){
    return util.formatTime2(new Date());
  },
  onReady: function () {

  },
  closeModal: function(){
    this.setData({
      showModal: false
    })
  },
  onShow: function () {
    this.onGetNow();

    let unitMap = app.globalData.unitMap;
    this.setData({
      unitMap
    })

    setTimeout(()=>{
      this.setData({
        showModal: true
      })
      return;
      wx.showModal({
        showCancel: false,
        title: '提示',
        confirmText: '我知道了',
        confirmColor: '#00b2f4',
        content: '左右滑动可切换上下题哦',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })  
    },1000)
   
  },
  onQueryCategory: function() {
    let that = this;
  

    const db = wx.cloud.database()
    db.collection('category').doc(this.data.pid).get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      that.setData({
        category:res.data
      });
    })
  },
  previewImg: function(){
    var index = 0;
    var imgArr = this.data.questions[this.data.currentIndex].imgs;
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
  bindKeyInput: function (e) {
    console.log(e.detail.value);
    let index = e.currentTarget.dataset.index;
    console.log(this.data.questions);
    console.log(this.data.currentIndex);
    let question = this.data.questions[this.data.currentIndex];
    let options = question.options;
    options[index]['text'] = e.detail.value;
    options[index]['selected'] = true;

    question.options = options;
    console.log(index);
    let questions = this.data.questions;
    let currentIndex = this.data.currentIndex;
    questions[currentIndex] = question;
    this.setData({
      questions,
      inputValue: e.detail.value
    })
  },
 
  selectAnswer: function (e) {
    console.log('selectAnswer');
    console.log(new Date())
    console.log(this.data.questions);
    console.log(e);
    console.log(e.currentTarget.dataset);
    let item = JSON.parse(e.currentTarget.dataset.value);

    let code = e.currentTarget.dataset.code;
    let answer = e.currentTarget.dataset.answer;
    let options = item.options;

    item.selected = true;

    item.status = false;
    
    options.map(o => {
      o.selected = false;
      if(o.code == code){
        o.selected = true;
      }

      if((o.code == code)&&(o.value == 1)){
        o.val = 1;
        item.status = true;
      }
      if((o.code == code)&&(o.value == 0)){
        o.val = 0;
        item.status = false;
        this.addNote(item);
      }
    })
    console.log('item');
    console.log(item);
    item.options = options;
    let questions = this.data.questions;
    questions[item.index] = item;

    let greenNum = 0;
    let redNum = 0;
    questions.forEach(item=>{
      if(item.selected && item.status){
        greenNum++;
      }

      if(item.selected && !item.status){
        redNum++;
      }
    })


    console.log(new Date())
    console.log({
      questions,
      greenNum,
      redNum
    })
    let  key = 'questions['+item.index+']';
    this.setData({
      [key]: item,
      greenNum,
      redNum
    },()=>{
      console.log(new Date());
      console.log('单选逻辑处理完成')
      this.updateMemory();

    })
    // if(item.index < this.data.nums-1){
    //   this.autoPlay();
    // }
  },
  selectAnswerMore: function (t) {
    console.log('多选选第二个选项')
    console.log('selectAnswerMore');
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    let code = t.currentTarget.dataset.code;
    let answer = t.currentTarget.dataset.answer;
    let options = item.options;

    item.selected = true;

    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    options.map(o => {
      if(o.code == code){
        o.selected = !o.selected;
      }
    })
    console.log(options);
    console.log(item);
    item.options = options;

    let arr1 = [];
    let arr2 = [];
    options.forEach(o => {
      if(o.value=='1'){
        arr1.push(o.code)
      }
      if(o.selected){
        arr2.push(o.code);
      }
    })
    if(arr1.join() == arr2.join()){
      greenNum++;
      item.status = true;
    }else{
      redNum++;
      item.status = false;
      // 2021-02-15 多选做错不记录到错题集
      // this.addNote(item);
    }

    let questions = this.data.questions;
    questions[item.index] = item;

    let  key = 'questions['+item.index+']';
    this.setData({
      [key]: item,
      greenNum,
      redNum
    },()=>{
      console.log('多选')
      this.updateMemory();
    })
  },
  newMoreSelectSub: function(t){
    setTimeout(()=>{
      this.moreSelectSub(t);
    },1000)
  },
  moreSelectSub: function (t) {
    console.log('多选');
    console.log('moreSelectSub');
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    console.log(item);

    if(item.selected){
      return;
    }
    let options = item.options;

    let nums = 0;

    let redNum = this.data.redNum;
    let greenNum = this.data.greenNum;

    item.selected = true;
    item.status = false;
    
    let typecode = item.typecode;
    switch(typecode){
      case '01':
      case '02':
      case '03':
        let arr1 = [];
        let arr2 = [];
        options.forEach(o => {
          if(o.value=='1'){
            arr1.push(o.code)
          }
          if(o.selected){
            arr2.push(o.code);
          }
        })
        if(arr1.join() == arr2.join()){
          greenNum++;
          item.status = true;
        }else{
          redNum++;
          item.status = false;
          this.addNote(item);
        }

        break;  
      case '04':
        let arr = [];
        let items = [];
        options.forEach(option=>{
          arr.push(option.text);
          items.push(option.content);
        })               
        if(arr.sort().join('') == items.sort().join('')){
          item.status = true;
        }else{
          item.status = false;
        }
        break;
      default: 
      console.log('其他未涉及题型')
    }
    let questions = this.data.questions;
    questions[item.index] = item;

    this.setData({
      questions,
      redNum,
      greenNum
    },()=>{
      console.log('多选提交完成')
      this.updateMemory();
    })
    console.log('item');
    console.log(item);

    // if(item.index < this.data.nums-1){
    //   this.autoPlay();
    // }
  },
  addNote: function(q){
    let that = this;
    let time = util.getTime(new Date());
    const db = wx.cloud.database()
    db.collection('notes').add({
      data: {
        category: q['category'],
        qid: q['_id'],
        question: q,
        time
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
  autoPlay: function () {
    console.log(new Date());
    console.log('autoplay');
    this.setData({
      autoplay: true
    });
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
      this.setData({
        showJiaoJuan: true
      })
    }
    this.setData({
      currentIndex: e.detail.current,
      autoplay: false
    })
   

  },

  newUp_exam:function() {
    wx.showLoading({
      title: '交卷中',
    })
    console.log(this.data.allNum);
    let that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['LGbr_wFfPYaPzCs9yHwQOgGEUUEVygZXN_0NEpMcyPU'],
      success (res) { 
        console.log(res);
        that.send(); 
      },
      fail (err){
        console.log(err);
        that.send(); 
      }
    })
     
    
  },

  timeServal: function (t) {
      console.log(t)
      let min = t;
      let sec = 59;
      let that = this;
      setInterval(()=>{
        sec < 10 ? this.setData({
          times: min + ":0" + sec,
          ytimes: t - min + ":" + (59 - sec)
        }) : this.setData({
          times: min + ":" + sec,
          ytimes: t - min + ":" + (59 - sec)
        });
        if(--sec < 0 ){
          sec = 59, min--
        }
      },1000);
  },

  result: function() {

    let that = this;

    let unitMap = this.data.unitMap;

    let questions = this.data.questions;
    let score = 0;
    questions.forEach(ques=>{
      if(ques.status){
        score += unitMap[ques.typecode];
      }
    })

    let time = util.getTime(new Date());

    const db = wx.cloud.database()
    db.collection('historys').add({
      data: {
        _id: that.data.ordernum,
        time: that.data.ytimes,
        md5: that.data.md5,
        questions: that.data.questions,
        userInfo: app.globalData.userInfo,
        categoryid: this.data.pid,
        category: that.data.category,
        score: score,
        createTime: time
      }
      })
      .then(res=>{
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        // 在返回结果中会包含新创建的记录的 _id  
        
        this.updateMemory2();
      })
      .catch(err=>{

      })

    wx.redirectTo({
      url: "../examresult/examresult?score="+score+"&ordernum="+this.data.ordernum+"&greenNum=" + this.data.greenNum + "&redNum=" + this.data.redNum + "&allNum=" + this.data.allNum + "&ytimes=" + this.data.ytimes + "&allfen=" + this.data.allfen + "&passf=" + this.data.passf + "&allQuestionCount=" + this.data.questions.length,
    })
  },

  onUnload: function () {
    
  },

  onHide: function () {
    
  },
  send: function(){

    let unitMap = this.data.unitMap;

    let questions = this.data.questions;
    let score = 0;
    questions.forEach(ques=>{
      if(ques.status){
        score += unitMap[ques.typecode];
      }
    })

    let time = util.formatTime(new Date());
    wx.cloud.callFunction({
      // 云函数名称
      name: 'send',
      // 传给云函数的参数
      data: {
        nickName: app.globalData.userInfo.nickName,
        nums: score,
        time: time
      },
    })
    .then(res => {
      console.log(res.result) // 3
      this.result();
    })
    .catch((err)=>{
      console.log(err);
      this.result();
    })
    
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
  },
  onGetNow: function(){
    let time = util.formatTime(new Date());
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getNow',
      // 传给云函数的参数
      data: {
      },
    })
    .then(res => {
      console.log(res.result) // 3
      this.setData({
        currentTime: res.result.now
      })
    })
    .catch((err)=>{
      console.log(err);
    })
    
  },
  onGetUUID: function() {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'getUUID',
      data: {

      }
    })
    .then(res => {
      console.log('[云函数] [getUUID]: ', res)
      this.setData({
        ordernum: res.result.uuid
      },()=>{
        console.log(this.data.ordernum);
      })
      
    }).catch(err => {
      console.error('[云函数] [getUUID] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  }
})