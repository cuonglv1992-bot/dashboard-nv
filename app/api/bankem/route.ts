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

    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

    const employees = rows
      .filter(
        (r) =>
          r &&
          r[2] &&
          typeof r[2] === "string" &&
          r[2].includes("-")
      )
      .map((r) => ({
        store: r[1],

        name: r[2],

        dtlk: Number(r[3] || 0),

        billBanKem: Number(r[6] || 0),

        tyLeBillBanKem:
          Number(r[7] || 0) * 100,

        slBanKem: Number(r[12] || 0),

        tyLeSPBanKem:
          Number(r[13] || 0) * 100,

        slBan: Number(r[17] || 0),
      }));

    const topBanKem = [...employees]
      .sort(
        (a, b) =>
          b.tyLeSPBanKem -
          a.tyLeSPBanKem
      )
      .slice(0, 10);

    const bottomBanKem = [...employees]
      .sort(
        (a, b) =>
          a.tyLeSPBanKem -
          b.tyLeSPBanKem
      )
      .slice(0, 10);

    return NextResponse.json({
      success: true,

      totalEmployees:
        employees.length,

      employees,

      topBanKem,

      bottomBanKem,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}