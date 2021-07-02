const cloud = require('wx-server-sdk')
cloud.init()
var xlsx = require('node-xlsx');
const db = cloud.database()

exports.main = async(event, context) => {
  let {
    fileID
  } = event
  //1,通过fileID下载云存储里的excel文件
  const res = await cloud.downloadFile({
    fileID: fileID,
  })
  const buffer = res.fileContent

  const tasks = [] //用来存储所有的添加数据操作
  //2,解析excel文件里的数据
  var sheets = xlsx.parse(buffer); //获取到所有sheets
  sheets.forEach(function(sheet) {
    console.log(sheet['name']);
    for (var rowId in sheet['data']) {
      console.log(rowId);
      var row = sheet['data'][rowId]; //第几行数据
      if (rowId > 0 && row) { //第一行是表格标题，所有我们要从第2行开始读
        //3，把解析到的数据存到excelList数据表里

        let typename = row[0];
        let title = row[1];
        let answer = row[6];
        let comments = row[7] || '';

        
        let options = [];
        switch(typename){
          case '单选':
            typecode = '01';
            options = [{
              code:'A',
              content: row[2],
              value: 0
            },{
              code:'B',
              content: row[3],
              value: 0
            },{
              code:'C',
              content: row[4],
              value: 0
            },{
              code:'D',
              content: row[5],
              value: 0
            }]
            options.forEach((o)=>{
              if(answer.indexOf(o.code) != -1){
                o.value = 1;
              }
            })
            break;
          case '多选':
            typecode = '02';
            options = [{
              code:'A',
              content: row[2],
              value: 0
            },{
              code:'B',
              content: row[3],
              value: 0
            },{
              code:'C',
              content: row[4],
              value: 0
            },{
              code:'D',
              content: row[5],
              value: 0
            }]
            options.forEach((o)=>{
              if(answer.indexOf(o.code) != -1){
                o.value = 1;
              }
            })
            break;
          case '判断':
            typecode = '03';
            options = [{
              code:'A',
              content: row[2],
              value: 0
            },{
              code:'B',
              content: row[3],
              value: 0
            }]
            options.forEach((o)=>{
              if(answer.indexOf(o.code) != -1){
                o.value = 1;
              }
            })
            break;
        }

        
        const promise = db.collection('test')
          .add({
            data: {
              category: event.category,
              typecode: typecode,
              typename: typename, 
              title: title, 
              options: options,
              answer: answer,
              comments: comments
            }
          })
        tasks.push(promise)
      }
    }
  });

  // 等待所有数据添加完成
  let result = await Promise.all(tasks).then(res => {
    return res
  }).catch(function(err) {
    return err
  })
  return result
}