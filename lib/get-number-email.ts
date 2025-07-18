"use server";
import { google } from "googleapis";

export async function getEmailCountFromEmailColumn(): Promise<{
  success: boolean;
  count: number;
  message?: string;
}> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID_FOR_WAITLIST;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const emailColumnRange = "B:B"; // Column B contains the actual emails

    // Get all values from email column
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: emailColumnRange,
    });

    // Filter out empty cells and count only valid emails
    const emailValues = result.data.values || [];
    const validEmails = emailValues.filter(
      (row) => row && row[0] && row[0].toString().trim() !== "",
    );

    const emailCount = validEmails.length;

    console.log(`Total valid emails in sheet: ${emailCount}`);

    return {
      success: true,
      count: emailCount,
      message: `Found ${emailCount} valid emails in the sheet`,
    };
  } catch (err) {
    console.error("Error getting email count from email column:", err);
    return {
      success: false,
      count: 0,
      message: "Failed to retrieve email count from email column",
    };
  }
}
