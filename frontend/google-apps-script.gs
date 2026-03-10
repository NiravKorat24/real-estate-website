/*
  Google Apps Script for floor-plan unlock leads.
  Setup:
  1) Create a Google Sheet and note its Spreadsheet ID from the URL.
  2) In Apps Script, paste this file and set SPREADSHEET_ID + SHEET_NAME.
  3) Deploy > New deployment > Web app:
     - Execute as: Me
     - Who has access: Anyone
  4) Copy the Web app URL and paste it in site.html:
     FLOORPLAN_LEAD_WEBHOOK_URL
*/

const SPREADSHEET_ID = "103bTucGoU56nnArrip9JLBx8tdWqUxap9nY55XzWYi8";
const SHEET_NAME = "Silvassa";

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    if (!payload) return jsonResponse_({ ok: false, error: "Missing payload" });

    const sheet = getSheet_();
    ensureHeader_(sheet);

    const row = [
      new Date(),
      payload.source || "",
      payload.name || "",
      payload.phone || "",
      payload.property?.id || "",
      payload.property?.name || "",
      payload.property?.type || "",
      payload.property?.size || "",
      payload.property?.areaLabel || "",
      payload.property?.areaValue || "",
      payload.property?.location || "",
      payload.ownerWhatsApp || "",
      payload.submittedAt || ""
    ];
    sheet.appendRow(row);

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    service: "floorplan-leads",
    date: new Date().toISOString()
  });
}

function testWrite() {
  const sheet = getSheet_();
  ensureHeader_(sheet);
  sheet.appendRow([
    new Date(),
    "manual_test",
    "Test User",
    "9999999999",
    "test-property",
    "Test Property",
    "Flat",
    "2 BHK",
    "Area",
    "1200 sq. ft",
    "Test City",
    "7990521795",
    new Date().toISOString()
  ]);
}

function parsePayload_(e) {
  if (!e) return null;

  if (e.postData && e.postData.contents) {
    const raw = e.postData.contents;
    try {
      // Try raw JSON body first.
      return JSON.parse(raw);
    } catch (_) {}
  }

  // Fallback for x-www-form-urlencoded: payload=<json>
  if (e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload);
  }

  return null;
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(String(SPREADSHEET_ID).trim());
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  return sheet;
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow([
    "Timestamp",
    "Source",
    "Customer Name",
    "Customer Phone",
    "Property ID",
    "Property Name",
    "Property Type",
    "Property Size",
    "Area Label",
    "Area Value",
    "Property Location",
    "Owner WhatsApp",
    "Submitted At (ISO)"
  ]);
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
