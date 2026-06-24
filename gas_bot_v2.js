var CHANNEL_ACCESS_TOKEN = '';

function doPost(e) {
  // ป้องกัน Error กรณีไม่มีข้อมูลส่งมา (เช่น การกด Run ใน Editor)
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
  var responseImage = "";

  if (/.*น้ำมัน.*/.test(userMessage) && /.*รถ.*/.test(userMessage)) {
    responseText = "ลิ้งนี้ https://script.google.com/macros/s/AKfycbyrimYzpFj9qEUgATD5n1s8YqnhmAyFZSHH80AAf0NWIvZ7VSKOAB9zkTFawRC1gBIaTg/exec";
    responseImage = "https://lh3.googleusercontent.com/d/1A-ArkjWy-xA1UxUJVMdeD79P2jiYL_WU";
  }
  else if ((/.*คำนวน.*/.test(userMessage) || /.*คำนวณ.*/.test(userMessage)) && /.*เงินกู้.*/.test(userMessage)) {
    responseText = "ขอสลิปเงินเดือนย้อนหลังสามเดือนด้วยค่ะ";
    if(/.*ฉุกเฉิน.*/.test(userMessage) || /.*ฉฉ.*/.test(userMessage)) {
      responseText += "\nถ้าหากเป็นนักงานราชการ ขอทราบวันสิ้นสุดสัญญาจ้างด้วยค่ะ";
    }
  } 
  else if (/^จอง.*/.test(userMessage)) {
    responseText = "รับทราบการจองครับ! กรุณาพิมพ์ วัน/เวลา ที่ต้องการ";
  }
  else if (/(สวัสดี|หวัดดี|hi|hello)/i.test(userMessage)) {
    responseText = "สวัสดีครับ มีอะไรให้ช่วยไหมครับ?";
  }
  else {
    return; 
  }

  sendReply(replyToken, responseText, responseImage);
}

function sendReply(replyToken, text, imageUrl) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  
  // สร้าง Array สำหรับข้อความที่จะส่ง
  var messages = [
    {
      'type': 'text',
      'text': text
    }
  ];

  // ถ้ามีการส่ง URL รูปภาพมา ให้เพิ่มวัตถุรูปภาพเข้าไปใน Array
  if (imageUrl) {
    messages.push({
      'type': 'image',
      'originalContentUrl': imageUrl,
      'previewImageUrl': imageUrl // รูปพรีวิว (แนะนำให้ใช้รูปเดียวกันหรือรูปที่ย่อขนาดแล้ว)
    });
  }

  var options = {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': messages // ส่งอาเรย์ที่มีทั้งข้อความและรูป
    })
  };
  UrlFetchApp.fetch(url, options);
}