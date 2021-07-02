// 云函数入口文件
const cloud = require('wx-server-sdk')

const dateUtils = require('date-utils')

cloud.init()

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  try {
    let dt = new Date();
    let today = dt.toFormat("YYYY-MM-DD");
    let time = dt.toFormat("YYYY-MM-DD HH24:MI:SS");

    // 清空数据
    await db.collection('ranks').where({
      _id: _.exists(true)
    }).remove()

    let res = await db.collection('profiles')
    .aggregate()
    .limit(1000)
    .end()

    console.log(res);

    let items = res.list;
    items.forEach(async (item, index) => {
      console.log(index);

      let _openid = item['_openid'];
      let userInfo = item['userInfo'];
      
      let res2 = await db.collection('history')
      .aggregate()
      .match({
        _openid: _openid
      })
      .limit(1000)
      .end()

      let items2 = res2.list;
      let score = 0;
      items2.forEach(item=>{
        if(item.score > score){
          score = item.score;
        }
      });

      db.collection('ranks').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          _openid: _openid,
          userInfo: userInfo,
          score: score,
          time: time
        }
      })
      .then(res => {
        console.log(res)
      })
      .catch(err=>{
        console.log(err);
      })

    })

  

  } catch(e) {
    console.error(e)
  }
}