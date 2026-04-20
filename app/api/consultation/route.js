import { google } from "googleapis";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경변수가 설정되지 않았습니다.`);
  return value;
}

function createSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: requiredEnv("GOOGLE_CLIENT_EMAIL"),
      private_key: requiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

function formatDateTime() {
  return new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour12: false,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { applicant, diagnosis } = body || {};

    if (!applicant?.name || !applicant?.phone) {
      return Response.json({ ok: false, message: "이름과 전화번호가 필요합니다." }, { status: 400 });
    }

    if (!diagnosis?.suitable) {
      return Response.json({ ok: false, message: "부적합 결과는 저장할 수 없습니다." }, { status: 400 });
    }

    const sheets = createSheetsClient();
    const spreadsheetId = requiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "상담신청";
    const headers = request.headers;

    const row = [
      formatDateTime(),
      diagnosis.suitable ? "적합" : "부적합",
      applicant.name,
      applicant.phone,
      diagnosis.occupation || "",
      Math.round((diagnosis.monthlyIncomeWon || 0) / 10000),
      diagnosis.maritalStatus || "",
      diagnosis.minorChildren ?? "",
      diagnosis.hasVehicle || "",
      Math.round((diagnosis.vehicleValueWon || 0) / 10000),
      Math.round((diagnosis.creditLoanWon || 0) / 10000),
      Math.round((diagnosis.securedLoanWon || 0) / 10000),
      Math.round((diagnosis.totalDebtWon || 0) / 10000),
      Math.round((diagnosis.realEstateValueWon || 0) / 10000),
      Math.round((diagnosis.depositValueWon || 0) / 10000),
      Math.round((diagnosis.totalAssetsWon || 0) / 10000),
      diagnosis.familySize ?? "",
      Math.round((diagnosis.minimumLivingCostWon || 0) / 10000),
      Math.round((diagnosis.monthlyDisposableIncomeWon || 0) / 10000),
      Math.round((diagnosis.expectedRepayment36Won || 0) / 10000),
      Math.round((diagnosis.expectedTotalRepaymentWon || 0) / 10000),
      Math.round((diagnosis.estimatedInterestWon || 0) / 10000),
      Math.round((diagnosis.totalClaimWon || 0) / 10000),
      Math.round((diagnosis.expectedReductionWon || 0) / 10000),
      Math.round(diagnosis.reductionRate || 0),
      (diagnosis.unsuitableReasons || []).join(" | "),
      headers.get("user-agent") || "",
      headers.get("referer") || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:AB`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: error?.message || "구글 시트 저장 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
