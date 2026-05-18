
// ============================================
// YiwuMarketConnect - Form to Google Sheet
// ============================================
// 1. 创建一个新的 Google Sheet
// 2. 点击 Extensions > Apps Script
// 3. 把这段代码全部粘贴进去
// 4. 点击 Save (Ctrl+S)
// 5. 点击 Deploy > New deployment
// 6. 选择 Type: Web app
// 7. Execute as: Me
// 8. Who has access: Anyone
// 9. 点击 Deploy，复制 Web App URL
// 10. 把 URL 填到下面的 FORM_ACTION_URL

const SHEET_NAME = 'Inquiries';

function doPost(e) {
  // Handle CORS preflight
  if (e.parameter.method === "OPTIONS") {
    return handleCORS();
  }

  try {
    const data = JSON.parse(e.postData.contents);

    // Get or create sheet
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
      // Add headers
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Email',
        'WhatsApp',
        'Business Type',
        'Product Description',
        'Order Volume',
        'Shipping Country',
        'Source'
      ]);
      // Format header row
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
    }

    // Append data
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.whatsapp || '',
      data.businessType || '',
      data.productDescription || '',
      data.orderVolume || '',
      data.shippingCountry || '',
      data.source || 'Website'
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Thank you! We will reply within 24 hours.'
    })).setMimeType(ContentService.MimeType.JSON).setHeaders(handleCORS().getHeaders());

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'OK',
    message: 'YiwuMarketConnect Form API is running'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleCORS() {
  const output = ContentService.createTextOutput('');
  output.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600'
  });
  return output;
}
