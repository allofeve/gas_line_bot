var CHANNEL_ACCESS_TOKEN = 'ใส่_CHANNEL_ACCESS_TOKEN_ของคุณที่นี่';

function doPost(e) {
  // ป้องกัน Error กรณีไม่มีข้อมูลส่งมา หรือการกด Run ใน Editor
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
  var messagesToSend = []; // เก็บชุดข้อความที่จะส่ง (สูงสุด 5 ชิ้น)

  // --- ส่วนการตรวจสอบเงื่อนไขและเตรียมข้อความ (Logics) ---

  // 1. ข้อความทั่วไป + อีโมจิ (ใช้อีโมจิปกติได้เลย)
  if (userMessage === "สวัสดี") {
    messagesToSend.push({
      "type": "text",
      "text": "สวัสดีครับคุณต้า! ยินดีที่ได้รู้จักครับ 😊🙏"
    });
  }

  // 2. รูปภาพ (Image) + สติกเกอร์ (Sticker)
  else if (userMessage === "รูปภาพ") {
    messagesToSend.push({
      "type": "image",
      "originalContentUrl": "https://example.com/image.jpg", // เปลี่ยนเป็น URL รูปของคุณ
      "previewImageUrl": "https://example.com/preview.jpg"
    });
    messagesToSend.push({
      "type": "sticker",
      "packageId": "446",
      "stickerId": "1988"
    });
  }

  // 3. วิดีโอ (Video) + เสียง (Audio)
  else if (userMessage === "วิดีโอ") {
messagesToSend.push({
      "type": "video",
      "originalContentUrl": "https://example.com/video.mp4",
      "previewImageUrl": "https://example.com/preview.jpg"
    });
  }

  // 4. ตำแหน่งที่ตั้ง (Location)
  else if (userMessage === "ที่อยู่") {
    messagesToSend.push({
      "type": "location",
      "title": "สำนักงานใหญ่",
      "address": "123 ถนนสุขุมวิท กรุงเทพมหานคร",
      "latitude": 13.7563,
      "longitude": 100.5018
    });
  }

  // 5. Flex Message (รูปแบบอิสระ)
  else if (userMessage === "เมนู") {
    messagesToSend.push({
      "type": "flex",
      "altText": "เมนูหลัก",
      "contents": {
        "type": "bubble",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [{ "type": "text", "text": "MAIN MENU", "weight": "bold", "color": "#ffffff" }],
          "backgroundColor": "#00b900"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            { "type": "button", "action": { "type": "message", "label": "เช็คราคาน้ำมัน", "text": "น้ำมัน" }, "style": "primary", "margin": "sm" },
            { "type": "button", "action": { "type": "message", "label": "จองที่พัก", "text": "จอง" }, "style": "secondary", "margin": "sm" }
          ]
        }
      }
    });
  }

  // 6. กรณีใช้ RegEx ตรวจจับคำ (เช่น ราคาน้ำมัน)
  else if (/.*น้ำมัน.*/.test(userMessage)) {
    messagesToSend.push({
      "type": "text",
      "text": "เช็คราคาน้ำมันล่าสุดได้ที่:\n https://script.google.com/macros/s/AKfycbyrimYzpFj9qEUgATD5n1s8YqnhmAyFZSHH80AAf0NWIvZ7VSKOAB9zkTFawRC1gBIaTg/exec"
    });
  }

  // ส่งข้อความทั้งหมดที่เตรียมไว้ (ถ้ามี)
  if (messagesToSend.length > 0) {
    sendReply(replyToken, messagesToSend);
  }
}

// ฟังก์ชันหลักในการส่งคำขอไปยัง LINE API
function sendReply(replyToken, messagesToSend) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var options = {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': messagesToSend
    })
  };
  
  try {
    UrlFetchApp.fetch(url, options);
  } catch (err) {
    console.log("Error sending message: " + err.message);
  }
}