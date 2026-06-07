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

    const sheet = workbook.Sheets["DATA DT"];

    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });
console.log(
  rows.slice(0, 20).map((r, i) => [
    i,
    r[1]
  ])
);

    function normalizeName(name: string) {
      return String(name || "")
        .split("-")[0]
        .trim()
        .toLowerCase();
    }

    // =========================
    // DOANH THU DML THANH CHÂU
    // =========================

    const store1Employees = rows
  .slice(3, 20)
  .filter((r) => r[1])
  .map((r) => ({
    name: String(r[1]).trim(),
    dttt: Number(r[2] || 0),
    dtqd: Number(r[3] || 0),
    hq: Number(r[4] || 0),
    sl: Number(r[5] || 0),
    dongia: Number(r[6] || 0),
    store: "DML Thanh Châu",
  }));

    // =========================
    // DOANH THU TGDD ĐINH TIÊN HOÀNG
    // =========================

    const store2Employees = rows
      .slice(20, 28)
      .filter((r) => r[1])
      .map((r) => ({
        name: String(r[1]).trim(),
        dttt: Number(r[2] || 0),
        dtqd: Number(r[3] || 0),
        hq: Number(r[4] || 0),
        sl: Number(r[5] || 0),
        dongia: Number(r[6] || 0),
        store: "TGDD Đinh Tiên Hoàng",
      }));

    const employees = [
      ...store1Employees,
      ...store2Employees,
    ];
    // =========================
    // BÁN KÈM
    // =========================

    const bankemSheet =
      workbook.Sheets["BÁN KÈM"];

    const bankemRows: any[][] =
      XLSX.utils.sheet_to_json(
        bankemSheet,
        { header: 1 }
      );

    const bankemMap = new Map();

    bankemRows
      .filter(
        (r) =>
          r &&
          r[2] &&
          typeof r[2] === "string" &&
          r[2].includes("-")
      )
      .forEach((r) => {
        bankemMap.set(
          normalizeName(r[2]),
          {
            slBan: Number(r[17] || 0),
            slBanKem: Number(r[12] || 0),
            tyLeSPBanKem:
              Number(r[13] || 0) * 100,
          }
        );
      });
    // =========================
    // TRẢ CHẬM DML
    // =========================

    const traChamDML = rows
      .slice(34, 53)
      .filter((r) => r[1])
      .map((r) => ({
        name: String(r[1]).trim(),
        traCham:
          Number(r[2] || 0) +
          Number(r[4] || 0) +
          Number(r[6] || 0) +
          Number(r[8] || 0) +
          Number(r[10] || 0),
        tyLeTraCham: Number(r[15] || 0),
      }));

    // =========================
    // TRẢ CHẬM TGDD
    // =========================

    const traChamTGDD = rows
      .slice(79, 87)
      .filter((r) => r[1])
      .map((r) => ({
        name: String(r[1]).trim(),
        traCham:
          Number(r[2] || 0) +
          Number(r[4] || 0) +
          Number(r[6] || 0) +
          Number(r[8] || 0) +
          Number(r[10] || 0),
        tyLeTraCham: Number(r[15] || 0),
      }));

    // =========================
    // MAP TRẢ CHẬM
    // =========================

    const traChamMap = new Map();

    [...traChamDML, ...traChamTGDD].forEach(
      (nv) => {
        traChamMap.set(
          normalizeName(nv.name),
          nv
        );
      }
    );

    // =========================
    // GHÉP TRẢ CHẬM
    // =========================

    const employeesWithTraCham =
      employees.map((nv) => {
        const tc = traChamMap.get(
          normalizeName(nv.name)
        );
        const bk = bankemMap.get(
          normalizeName(nv.name)
        );
        return {
          ...nv,

          hieuQuaQD:
            nv.dttt > 0
              ? Number(
                (
                  (nv.dtqd / nv.dttt) *
                  100
                ).toFixed(1)
              )
              : 0,

          traCham:
            tc?.traCham ?? 0,

          tyLeTraCham:
            tc?.tyLeTraCham ?? 0,
          slBan:
            bk?.slBan ?? 0,

          slBanKem:
            bk?.slBanKem ?? 0,

          tyLeSPBanKem:
            bk?.tyLeSPBanKem ?? 0,
        };
      });

    // =========================
    // TOP DTQĐ
    // =========================

    const topEmployees = [
      ...employeesWithTraCham,
    ]
      .sort(
        (a, b) => b.dtqd - a.dtqd
      )
      .slice(0, 10);

    // =========================
    // TOP TRẢ CHẬM
    // =========================

    const topTraCham = [
      ...employeesWithTraCham,
    ]
      .sort(
        (a, b) =>
          b.tyLeTraCham -
          a.tyLeTraCham
      )
      .slice(0, 10);

    // =========================
    // KPI TỔNG
    // =========================

    const totalDTTT =
      employeesWithTraCham.reduce(
        (sum, nv) =>
          sum + nv.dttt,
        0
      );

    const totalDTQD =
      employeesWithTraCham.reduce(
        (sum, nv) =>
          sum + nv.dtqd,
        0
      );

    const totalSL =
      employeesWithTraCham.reduce(
        (sum, nv) =>
          sum + nv.sl,
        0
      );

    // =========================
    // KPI CỬA HÀNG
    // =========================

    const dmlDTQD = store1Employees.reduce(
      (sum, nv) => sum + nv.dtqd,
      0
    );

    const tgddDTQD = store2Employees.reduce(
      (sum, nv) => sum + nv.dtqd,
      0
    );

    const dmlGTDH =
      store1Employees.reduce(
        (sum, nv) => sum + nv.dongia,
        0
      ) / store1Employees.length;

    const tgddGTDH =
      store2Employees.reduce(
        (sum, nv) => sum + nv.dongia,
        0
      ) / store2Employees.length;
    // =========================
    // DATA_NH
    // =========================

    const nhSheet =
      workbook.Sheets["DATA_NH"];
const thiDuaSTSheet =
  workbook.Sheets["DATA_THIDUA_ST"];

const tdRows: any[][] =
  XLSX.utils.sheet_to_json(
    thiDuaSTSheet,
    { header: 1 }
  );

const thiDuaDML = tdRows
  .slice(3, 45)
  .filter(
  (r) =>
    r[0] &&
    ["X", "VIP"].includes(
      String(r[8] || "")
        .trim()
        .toUpperCase()
    )
)
  .map((r) => ({
    nganh: String(r[0] || "").trim(),

    luyKe: Number(r[1] || 0),

    target: Number(r[2] || 0),

    htdk: Number(r[4] || 0) * 100,

    flag: String(r[8] || "")
      .trim()
      .toUpperCase(),
  }));

const thiDuaTGDD = tdRows
  .slice(3, 30)
  .filter(
  (r) =>
    r[10] &&
    ["X", "VIP"].includes(
      String(r[18] || "")
        .trim()
        .toUpperCase()
    )
)
  .map((r) => ({
    nganh: String(r[10] || "").trim(),

    luyKe: Number(r[11] || 0),

    target: Number(r[12] || 0),

    htdk: Number(r[14] || 0) * 100,

    flag: String(r[18] || "")
      .trim()
      .toUpperCase(),
  }));

    const nhRows: any[][] =
      XLSX.utils.sheet_to_json(
        nhSheet,
        { header: 1 }
      );
console.log(
  "NH ROW 1",
  nhRows[1]
);

console.log(
  "NH ROW 2",
  nhRows[2]
);

console.log(
  "NH ROW 34",
  nhRows[34]
);

console.log(
  "NH ROW 35",
  nhRows[35]
);
const today = new Date().getDate();

// Số ngày đã chạy
const elapsedDays =
  Math.max(today - 1, 1);


const daysInMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  0
).getDate();
    // DML
    const industryDML = nhRows
      .slice(1, 20)
      .filter((r) => r[1])
      .map((r) => ({
        nganh: String(r[1]).trim(),

        dtqd: Number(r[3] || 0),

        target: Number(r[4] || 0),
projected:
  (Number(r[3] || 0) /
    elapsedDays) *
  daysInMonth,
        percent: Number(r[6] || 0),

        dtck: Number(r[7] || 0),
      }));

    const dmlTotal = {
  dtqd: Number(nhRows[1]?.[3] || 0),
  target: Number(nhRows[1]?.[4] || 0),
  percent: Number(nhRows[1]?.[6] || 0),
  dtck: Number(nhRows[1]?.[7] || 0),
};

    // TGDD
    const industryTGDD = nhRows
      .slice(34, 60)
      .filter((r) => r[1])
      .map((r) => ({
        nganh: String(r[1]).trim(),

        dtqd: Number(r[3] || 0),
  
        target: Number(r[4] || 0),
projected:
  (Number(r[3] || 0) /
    elapsedDays) *
  daysInMonth,
        percent: Number(r[6] || 0),

        dtck: Number(r[7] || 0),
      }));

    const tgddTotal = {
      dtqd: Number(
        nhRows[34]?.[3] || 0
      ),

      target: Number(
        nhRows[34]?.[4] || 0
      ),

      percent: Number(
        nhRows[34]?.[6] || 0
      ),

      dtck: Number(
        nhRows[34]?.[7] || 0
      ),
    };
const totalTarget =
  dmlTotal.target +
  tgddTotal.target;

const currentDTQD =
  dmlTotal.dtqd +
  tgddTotal.dtqd;



const projectedDTQD =
  (currentDTQD / elapsedDays) *
  daysInMonth;

const totalPercent =
  totalTarget > 0
    ? (projectedDTQD /
        totalTarget) *
      100
    : 0;
    // %HT DỰ KIẾN DML
const dmlProjectedPercent =
  dmlTotal.target > 0
    ? (
        (
          (dmlTotal.dtqd / elapsedDays) *
          daysInMonth
        ) /
        dmlTotal.target
      ) * 100
    : 0;

// %HT DỰ KIẾN TGDD
const tgddProjectedPercent =
  tgddTotal.target > 0
    ? (
        (
          (tgddTotal.dtqd / elapsedDays) *
          daysInMonth
        ) /
        tgddTotal.target
      ) * 100
    : 0;
   const dmlTotalDisplay = {
  ...dmlTotal,

  projected:
    (dmlTotal.dtqd / elapsedDays) *
    daysInMonth,

  projectedPercent:
    dmlProjectedPercent,
};

const tgddTotalDisplay = {
  ...tgddTotal,

  projected:
    (tgddTotal.dtqd / elapsedDays) *
    daysInMonth,

  projectedPercent:
    tgddProjectedPercent,
};

console.log(
  "INDUSTRY DML COUNT",
  industryDML.length
);

console.log(
  "INDUSTRY DML SAMPLE",
  industryDML.slice(0,5)
);

console.log(
  "INDUSTRY TGDD COUNT",
  industryTGDD.length
);

console.log(
  "INDUSTRY TGDD SAMPLE",
  industryTGDD.slice(0,5)
);
    return NextResponse.json({
      success: true,

      summary: {
  totalTarget,

  totalDTQD: currentDTQD,

  totalPercent,
projectedDTQD,
  totalTraCham:
    (
      Number(nhRows[1]?.[10] || 0) +
      Number(nhRows[34]?.[10] || 0)
    ) /
    2 *
    100,
},

      stores: [
        {
          name: "DML Thanh Châu",
          dtqd: Number(dmlDTQD.toFixed(2)),
          gtdh: Number(dmlGTDH.toFixed(2)),
          traChamPercent: Number(nhRows[1]?.[10] || 0) * 100,
        },
        {
          name: "TGDD Đinh Tiên Hoàng",
          dtqd: Number(tgddDTQD.toFixed(2)),
          gtdh: Number(tgddGTDH.toFixed(2)),
          traChamPercent: Number(nhRows[34]?.[10] || 0) * 100,
        },
      ],

      employees: employeesWithTraCham,

      topEmployees,

      topTraCham,

      industryDML,
      industryTGDD,

      dmlTotal: dmlTotalDisplay,
tgddTotal: tgddTotalDisplay,
thiDuaDML,
thiDuaTGDD,
    });
  } catch (error) {
    
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}