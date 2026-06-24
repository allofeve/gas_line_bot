var CHANNEL_ACCESS_TOKEN = '';

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var event = contents.events[0];
  
  if (event.type !== 'message' || event.message.type !== 'text') {
    return; // สนใจเฉพาะข้อความตัวอักษร
  }

  var userMessage = event.message.text;
  var replyToken = event.replyToken;
  var responseText = "";

  // --- ส่วนการใช้ Wildcard (Regular Expression) ---

  // 1. ตรวจจับคำว่า "ราคา" ตามด้วยอะไรก็ได้ (Wildcard: .*)
  if (/.*น้ำมัน.*/.test(userMessage)) {
    responseText = "https://script.google.com/macros/s/AKfycbyrimYzpFj9qEUgATD5n1s8YqnhmAyFZSHH80AAf0NWIvZ7VSKOAB9zkTFawRC1gBIaTg/exec";
  } 
  
  // 2. ตรวจจับคำขึ้นต้นด้วย "จอง" หรือ "จองที่พัก" (Wildcard เฉพาะเจาะจง)
  else if (/^จอง.*/.test(userMessage)) {
    responseText = "รับทราบการจองครับ! กรุณาพิมพ์ วัน/เวลา ที่ต้องการ";
  }

  // 3. ตรวจจับหลายคำ (OR) เช่น "หวัดดี", "สวัสดี", "hi"
  else if (/(สวัสดี|หวัดดี|hi|hello)/i.test(userMessage)) {
    responseText = "สวัสดีครับ มีอะไรให้ช่วยไหมครับ?";
  }

  // กรณีไม่ตรงกับเงื่อนไขใดเลย (Default)
  else {
    // responseText = "ขออภัยครับ ผมไม่เข้าใจคำถาม ลองพิมพ์คำว่า 'ราคา' หรือ 'จอง' ดูครับ";
    return; // หรือจะไม่ตอบอะไรเลยก็ได้
  }

  // ส่งข้อความกลับหาผู้ใช้
  sendReply(replyToken, responseText);
}

function sendReply(replyToken, text) {
  var url = 'https://api.line.me';
  var options = {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
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
