import { google } from "googleapis";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`환경변수 ${name} 가 설정되지 않았습니다.`);
  }
  return value;
}

function getGoogleAuth() {
  const clientEmail = requiredEnv("GOOGLE_CLIENT_EMAIL");
  const privateKey = requiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function formatCurrency(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? num : 0;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const applicant = body?.applicant || {};
    const diagnosis = body?.diagnosis || {};
    const privacyAgreed = !!body?.privacyAgreed;

    const name = String(applicant?.name || "").trim();
    const phone = String(applicant?.phone || "").trim();

    if (!name || !phone) {
      return NextResponse.json(
        { ok: false, message: "이름과 전화번호는 필수입니다." },
        { status: 400 }
      );
    }

    const spreadsheetId = requiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "상담신청";

    const auth = getGoogleAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const now = new Date();
    const submittedAt = now.toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
    });

    const row = [
      submittedAt,
      name,
      phone,
      privacyAgreed ? "동의" : "미동의",

      diagnosis.suitable ? "적합" : "부적합",

      diagnosis.occupation || "",
      diagnosis.maritalStatus || "",
      diagnosis.minorChildren ?? 0,
      diagnosis.hasVehicle || "",
      formatCurrency(diagnosis.vehicleValueWon),

      diagnosis.assetsStatus || "",
      formatCurrency(diagnosis.realEstateValueWon),
      formatCurrency(diagnosis.depositValueWon),
      formatCurrency(diagnosis.totalAssetsWon),

      formatCurrency(diagnosis.monthlyIncomeWon),
      formatCurrency(diagnosis.creditLoanWon),
      formatCurrency(diagnosis.securedLoanWon),
      formatCurrency(diagnosis.totalDebtWon),

      diagnosis.familySize ?? 0,
      formatCurrency(diagnosis.minimumLivingCostWon),
      formatCurrency(diagnosis.monthlyDisposableIncomeWon),
      formatCurrency(diagnosis.expectedRepayment36Won),
      formatCurrency(diagnosis.expectedTotalRepaymentWon),
      formatCurrency(diagnosis.estimatedInterestWon),
      formatCurrency(diagnosis.totalClaimWon),
      formatCurrency(diagnosis.expectedReductionWon),
      Math.round(Number(diagnosis.reductionRate || 0)),

      Array.isArray(diagnosis.unsuitableReasons)
        ? diagnosis.unsuitableReasons.join(" | ")
        : "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:AC`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    return NextResponse.json({
      ok: true,
      message: "상담신청이 정상적으로 접수되었습니다.",
    });
  } catch (error) {
    console.error("consultation route error:", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          error?.message || "구글 스프레드시트 저장 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}