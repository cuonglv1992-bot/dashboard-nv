import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const XLSX = await import("xlsx");

    const filePath = path.join(
      process.cwd(),
      "data",
      "HIỆU QUẢ NV.xlsm"
    );

    const buffer = fs.readFileSync(filePath);

    const workbook = XLSX.read(buffer, {
      type: "buffer",
    });

   const sheet = workbook.Sheets["BÁN KÈM"];

    const data = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

    return NextResponse.json({
      success: true,
      rows: data.slice(0, 20),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}