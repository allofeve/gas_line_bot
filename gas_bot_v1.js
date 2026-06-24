var ACCESS_TOKEN = '';

function doPost(e) {
  if (typeof e === 'undefined' || !e.postData) {
    return ContentService.createTextOutput("Method not allowed");
  }

  var contents = JSON.parse(e.postData.contents);
  var event = contents.events[0];
  
  if (!event || event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  var userMessage = event.message.text;
  var replyToken = event.replyToken;
  var responseText = "";

  if (/.*น้ำมัน.*/.test(userMessage) && /.*รถ.*/.test(userMessage)) {
    responseText = "https://script.google.com/macros/s/AKfycbyrimYzpFj9qEUgATD5n1s8YqnhmAyFZSHH80AAf0NWIvZ7VSKOAB9zkTFawRC1gBIaTg/exec";
  } 
  // ตรวจจับขึ้นต้นด้วยคำที่กำหนด: "จองที่พัก", "จองโต๊ะ", "จอง"
  else if (/^จอง.*/.test(userMessage)) {
    responseText = "รับทราบการจองครับ! กรุณาพิมพ์ วัน/เวลา ที่ต้องการ";
  }
  else if (/(สวัสดี|หวัดดี|hi|hello)/i.test(userMessage)) {
    responseText = "สวัสดีครับ มีอะไรให้ช่วยไหมครับ?";
  }
  else {
    return; 
  }

  sendReply(replyToken, responseText);
}

function sendReply(replyToken, text) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var options = {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + ACCESS_TOKEN
    },
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': text
      }]
    })
  };
  UrlFetchApp.fetch(url, options);
}