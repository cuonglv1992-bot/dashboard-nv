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

    const sheet =
      workbook.Sheets["XL_DT_TD"];

    const rows: any[][] =
      XLSX.utils.sheet_to_json(sheet, {
        header: 1,
      });
      
console.log(rows.slice(0,15));
console.log(rows[1]);
console.log(rows[2]);
console.log(rows[3]);
console.log(rows[4]);
console.log(rows[5]);
    const data = rows
    
  .slice(1)
  .filter(
  (r) =>
    r[3] &&
    String(r[3]).trim() !== "Tổng"
)
  .map((r) => ({
  nhom: String(r[1] || "").trim(),

  vietTat: String(r[2] || "").trim(),

  nhanVien: String(r[3] || "").trim(),

  target: Number(r[5] || 0),

  luyKe: Number(r[6] || 0),

  percent: Number(r[18] || 0),
}));
    // Danh sách nhóm thi đua
    const groups = [
      ...new Set(
        data
          .map((x) => x.vietTat)
          .filter(Boolean)
      ),
    ];

    // Pivot theo nhân viên
    const employeeMap = new Map();

    data.forEach((item) => {
      if (
        !employeeMap.has(
          item.nhanVien
        )
      ) {
        employeeMap.set(
          item.nhanVien,
          {
            name:
              item.nhanVien,
          }
        );
      }

      const row =
        employeeMap.get(
          item.nhanVien
        );

      row[item.vietTat] =
        Math.round(
          item.percent
        );
    });

    const employeeThiDua =
      Array.from(
        employeeMap.values()
      );

   return NextResponse.json({
  success: true,
  groups,
  employeeThiDua,

  employeeDetails: data,
});
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}