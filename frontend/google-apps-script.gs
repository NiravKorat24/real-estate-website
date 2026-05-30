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
const SHEET_NAME = "Silvassa Leads";

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    if (!payload) return jsonResponse_({ ok: false, error: "Missing payload" });

    const sheet = getSheet_();
    ensureHeader_(sheet);

    // Formulate a clean description of customer details depending on lead source
    let details = "";
    if (payload.source === "project_popup_enquiry") {
      details = payload.message || "General Project Inquiry";
    } else if (payload.source === "floorplan_unlock") {
      details = `Unlocked Floor Plan (${payload.property?.size || ""} ${payload.property?.type || ""})`;
    } else {
      details = payload.source || "Inquiry";
    }

    const row = [
      new Date(), // Date & Time
      payload.property?.name || "-", // Project Name
      payload.name || "", // Customer Name
      payload.phone || "", // Customer Phone
      details // Customer Details / Message
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
    "Test Property",
    "Test User",
    "9999999999",
    "Manual Test Lead"
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
    "Date & Time",
    "Project Name",
    "Customer Name",
    "Customer Phone",
    "Customer Details"
  ]);
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
