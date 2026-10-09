# Google Apps Script Code for Contact Form

Copy the code block below into **`Code.gs`** in your Google Apps Script editor ([script.google.com](https://script.google.com)):

```javascript
const DEFAULT_PRIMARY_EMAIL = "Pratik@asthaindia.in";
const DEFAULT_BLOOMING_EMAIL = "hello@bloominginpain.com";

function getTargetSheet() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    const files = DriveApp.getFilesByName("DEI Contact Form Submissions");
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      ss = SpreadsheetApp.create("DEI Contact Form Submissions");
    }
  }
  return ss.getActiveSheet();
}

function doPost(e) {
  try {
    let data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    const timestamp = new Date();
    const name = data.name || data.Name || "N/A";
    const email = data.email || data.Email || "N/A";
    const organisation = data.organisation || data.Organisation || "N/A";
    const phone = data.phone || data.Phone || "";
    const inquiryType = data.inquiry_type || data.inquiryType || "General Inquiry";
    const message = data.message || data.Message || "No message content provided.";

    // Determine recipient emails passed dynamically from website Admin Settings
    const primaryEmail = data.recipient_email || DEFAULT_PRIMARY_EMAIL;
    const bloomingEmail = data.blooming_email || DEFAULT_BLOOMING_EMAIL;

    const recipientList = [primaryEmail];
    const inquiryLower = (inquiryType || "").toLowerCase();

    // Send to Blooming in Pain email ONLY if inquiry is about Blooming in Pain
    if (inquiryLower.includes("blooming") || inquiryLower.includes("pain") || data.is_blooming_inquiry === true) {
      if (!recipientList.includes(bloomingEmail)) {
        recipientList.push(bloomingEmail);
      }
    }

    const recipientString = recipientList.join(",");

    // 1. Save entry to Google Sheet
    const sheet = getTargetSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Inquiry Type", "Name", "Email", "Organisation", "Phone", "Message", "Sent To"]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#4f46e5").setFontColor("#ffffff");
    }
    sheet.appendRow([timestamp, inquiryType, name, email, organisation, phone, message, recipientString]);

    // 2. Send instant email notification to Pratik (+ Blooming in Pain if applicable)
    const subject = `[New Contact Form Inquiry] ${inquiryType} from ${name}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-top: 0;">New Inquiry from DEI Portfolio</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Name:</td><td>${name}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
          ${organisation ? `<tr><td style="padding: 6px 0; font-weight: bold;">Organisation:</td><td>${organisation}</td></tr>` : ""}
          ${phone ? `<tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${phone}</td></tr>` : ""}
          <tr><td style="padding: 6px 0; font-weight: bold;">Inquiry Type:</td><td><span style="background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-weight: 500;">${inquiryType}</span></td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Notified Emails:</td><td>${recipientString}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
        <p style="font-weight: bold; margin-bottom: 8px;">Message:</p>
        <div style="background: #f9fafb; padding: 14px; border-left: 4px solid #4f46e5; border-radius: 4px; white-space: pre-wrap; color: #374151;">${message}</div>
        <br/>
        <p style="font-size: 12px; color: #6b7280; margin: 0;">Sent automatically from Pratik Aggarwal DEI Portfolio</p>
      </div>
    `;

    MailApp.sendEmail({
      to: recipientString,
      subject: subject,
      htmlBody: htmlBody,
      replyTo: email !== "N/A" ? email : primaryEmail
    });

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Submission saved and email sent to " + recipientString }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Google Apps Script Contact Form Webhook is active and running.");
}

function testRun() {
  Logger.log("Testing Apps Script permissions...");
  const sheet = getTargetSheet();
  Logger.log("Sheet ready: " + sheet.getName());
}
```

## How to Deploy the Update
1. Copy the code above.
2. Open **`Code.gs`** in your Google Apps Script editor ([script.google.com](https://script.google.com)).
3. Paste the code into `Code.gs` and save (`Cmd + S`).
4. Click **Deploy** > **Manage deployments**.
5. Click **Edit (Pencil icon)** next to your active deployment.
6. Select **"New version"** under Version.
7. Click **Deploy**.
