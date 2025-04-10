"use server"
import { google } from "googleapis";

export async function appendContactToSheet(email: string, content: string) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID_FOR_CONTACT_US;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

//   const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth });

  try {
    const emailColumnRange = "A:A";

    // Get the current row count for serial number calculation
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: emailColumnRange,
    });

    const numRows = result.data.values ? result.data.values.length : 0;
    const nextRow = numRows + 1;
    const appendRange = `A${nextRow}:D${nextRow}`;

    // Prepare serial number and current date/time
    const serialNumber = nextRow;
    const dateTime = new Date().toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: appendRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[serialNumber, email, content, dateTime]],
      },
    });

    // console.log(
    //   `Data added successfully: Serial No. ${serialNumber}, Email "${email}", Content "${content}", Date/Time "${dateTime}" in row ${nextRow}.`,
    // );
    return { success: true, message: `Data added in row ${nextRow}` };
  } catch (err) {
    console.error("Error appending data:", err);
    throw err;
  }
}
