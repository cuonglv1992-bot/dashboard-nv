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
const thiduaSheet =
  workbook.Sheets[
    "DATA_THIDUA_ST"
  ];

const thiduaRows: any[][] =
  XLSX.utils.sheet_to_json(
    thiduaSheet,
    {
      header: 1,
    }
  );



console.log(
  "THIDUA1",
  thiduaRows[1]
);

console.log(
  "THIDUA2",
  thiduaRows[2]
);

console.log(
  "THIDUA3",
  thiduaRows[3]
);

console.log(
  "THIDUA4",
  thiduaRows[4]
);

console.log(
  "THIDUA5",
  thiduaRows[5]
);
   const sheet =
  workbook.Sheets["XL_DT_TD"];

const rows: any[][] =
  XLSX.utils.sheet_to_json(sheet, {
    header: 1,
  });

const kbSheet =
  workbook.Sheets["KB"];

const kbRows: any[][] =
  XLSX.utils.sheet_to_json(
    kbSheet,
    {
      header: 1,
    }
  );

const configSheet =
  workbook.Sheets["CONFIG"];

const configRows: any[][] =
  XLSX.utils.sheet_to_json(
    configSheet,
    {
      header: 1,
    }
  );

  console.log(
  JSON.stringify(
    configRows.slice(0,10),
    null,
    2
  )
);
const currentWeek =
  String(
    configRows[6]?.[1] || ""
  ).trim();

  console.log(
  "CONFIG7",
  configRows[7]
);

let currentRate = 0;

for (let i = 1; i <= 5; i++) {
  if (
    String(
      configRows[i]?.[1] || ""
    ).trim() === currentWeek
  ) {
    currentRate = Number(
      configRows[i]?.[2] || 0
    );

    break;
  }
}

if (currentRate > 1) {
  currentRate =
    currentRate / 100;
}

console.log(
  "CURRENT WEEK",
  currentWeek
);

console.log(
  "CURRENT RATE",
  currentRate
);

console.log(
  "CONFIG ROW 7 =",
  configRows[7]
);

console.log(
  "CONFIG ROW 2 =",
  configRows[2]
);

console.log(
  "CONFIG ROW 3 =",
  configRows[3]
);

console.log(
  "CONFIG ROW 4 =",
  configRows[4]
);

console.log(
  "CONFIG ROW 5 =",
  configRows[5]
);

console.log(
  "CONFIG ROW 6 =",
  configRows[6]
);
 const employeeTargetMap = new Map();

kbRows.forEach((row) => {
  const name = String(
    row[8] || ""
  ).trim();

  if (!name.includes("-")) {
    return;
  }

  employeeTargetMap.set(
    name,
    {
      dt: Number(row[32] || 0),
      tc: Number(row[33] || 0),
    }
  );
});

console.log(
  "TARGET MAP SIZE",
  employeeTargetMap.size
);

console.log(
  "DUAN TARGET",
  employeeTargetMap.get(
    "Đỗ Văn Duân - 62025"
  )
);

console.log(
  "NHUNG TARGET",
  employeeTargetMap.get(
    "Trần Thị Nhung - 11082"
  )
);

console.log(
  "TARGET MAP SIZE",
  employeeTargetMap.size
);

console.log(
  "DUAN TARGET",
  employeeTargetMap.get(
    "Đỗ Văn Duân - 62025"
  )
);

console.log(
  "NHUNG TARGET",
  employeeTargetMap.get(
    "Trần Thị Nhung - 11082"
  )
);
console.log(
  "DUAN KB =",
  employeeTargetMap.get(
    "Đỗ Văn Duân - 62025"
  )
);

console.log(
  "NHUNG TGDD =",
  employeeTargetMap.get(
    "Trần Thị Nhung - 11082"
  )
);

console.log(
  "KB72 =",
  JSON.stringify(kbRows[72])
);
console.log(
  JSON.stringify(
    kbRows.slice(65, 75),
    null,
    2
  )
);
  


console.log("KB1", kbRows[1]);
console.log("KB50", kbRows[50]);
const dmlGroups = kbRows
  .slice(0, 40)
  .filter(
    (r) =>
      String(r[4] || "")
        .trim()
        .toUpperCase() === "VIP"
  )
  .map((r) =>
    String(r[3] || "").trim()
  );

const tgddGroups = kbRows
  .slice(49, 75)
  .filter((r) => {
    const flag = String(
      r[4] || ""
    )
      .trim()
      .toUpperCase();

    return (
      flag === "VIP" ||
      flag === "X"
    );
  })
  .map((r) =>
    String(r[3] || "").trim()
  );

const stramGroups = [
  ...new Set([
    ...dmlGroups,
    ...tgddGroups,
  ]),
];
rows.slice(0,10).forEach((r,i)=>{
  console.log(
    "CHECK",
    i,
    "C=", r[2],
    "D=", r[3],
    "E=", r[4]
  );
});
   const data = rows
  .slice(1)
  .filter((r) => {
    const employee = String(r[4] || "").trim();

    return (
      employee.includes("-") ||
      employee.includes("Nhân viên")
    );
  })
  .map((r) => ({
    groupName: String(r[2] || "").trim(),
    shortName: String(r[3] || "").trim(),
    employee: String(r[4] || "").trim(),

    targetWeek: Number(r[12] || 0),
    actualWeek: Number(r[18] || 0),
    percentWeek: Number(r[19] || 0),
  }));

  console.log(
  "DATA SAMPLE",
  data.slice(0, 20)
);

  console.log(
  "DATA SAMPLE",
  data.slice(0,20)
);

console.log(
  "DATA COUNT",
  data.length
);

  const dmlResults = thiduaRows
  .slice(1, 40)
  .filter(
    (r) =>
      ["VIP"].includes(
        String(r[8] || "")
          .trim()
          .toUpperCase()
      )
  )
  .map((r) => ({
    shortName: String(r[0] || ""),

    actualMonth: Number(r[1] || 0),

    targetMonth: Number(r[2] || 0),

    percentMonth: Number(r[4] || 0)*100,

    forecastMonth: Number(r[4] || 0),

    remainMonth:
  Number(r[2] || 0) -
  Number(r[1] || 0),

targetWeek: Math.round(
  Number(r[2] || 0) *
  currentRate
),

rank: Number(r[5] || 0),

    topBottom: String(r[6] || ""),
  }));

const tgddResults = thiduaRows
  .slice(1, 40)
  .filter(
    (r) =>
      ["VIP", "X"].includes(
        String(r[18] || "")
          .trim()
          .toUpperCase()
      )
  )
  .map((r) => ({
    shortName: String(r[10] || ""),

    actualMonth: Number(r[11] || 0),

    targetMonth: Number(r[12] || 0),

    percentMonth: Number(r[14] || 0)*100,

    forecastMonth: Number(r[14] || 0),

   remainMonth:
  Number(r[12] || 0) -
  Number(r[11] || 0),

targetWeek: Math.round(
  Number(r[12] || 0) *
  currentRate
),

rank: Number(r[15] || 0),

    topBottom: String(r[16] || ""),
  }));


    const employeeMap =
      new Map();

    data.forEach((item) => {
      if (
        !employeeMap.has(
          item.employee
        )
      ) {
        employeeMap.set(
          item.employee,
          {
  name: item.employee,

  targetWeekTotal: 0,
  resultWeekTotal: 0,

  groups: [],
}
        );
      }

      const emp =
        employeeMap.get(
          item.employee
        );

      emp.targetWeekTotal =
  (emp.targetWeekTotal || 0) +
  item.targetWeek;

emp.resultWeekTotal =
  (emp.resultWeekTotal || 0) +
  item.actualWeek;
   

emp.groups.push({
  group: item.shortName,

  qty: Math.round(
    item.targetWeek
  ),

  actual: item.actualWeek,

  percent: item.percentWeek,
});

console.log(
  "EMPLOYEE MAP",
  Array.from(employeeMap.keys()).slice(0,20)
);
    });
const employees =
  Array.from(
    employeeMap.values()
  )
    .map((emp: any) => {

      const targetInfo =
        employeeTargetMap.get(
          emp.name
        ) || {
          dt: 0,
          tc: 0,
        };
console.log(
  "EMP NAME =",
  emp.name
);
console.log(
  "LOOKUP",
  emp.name,
  employeeTargetMap.get(
    emp.name
  )
);
console.log(
  "CARD",
  emp.name,
  targetInfo,
  currentRate
);
     return {
  ...emp,

  targetDT: targetInfo.dt,

  targetTC: targetInfo.tc,

        percentWeekTotal:
          emp.targetWeekTotal > 0
            ? (
                emp.resultWeekTotal /
                emp.targetWeekTotal
              ) * 100
            : 0,
      };
    })
    .sort(
      (a: any, b: any) =>
        b.percentWeekTotal -
        a.percentWeekTotal
    );
  

const dmlEmployeeNames = kbRows
  .slice(0, 40)
  .map((r) => String(r[8] || "").trim())
  .filter(
    (name) =>
      name &&
      name !== "Nhân viên Mới 1" &&
      name !== "Nhân viên Mới 2"
  );

dmlEmployeeNames.push(
  "Nhân viên Mới 1",
  "Nhân viên Mới 2"
);

const tgddEmployeeNames = kbRows
  .slice(49, 75)
  .map((r) => String(r[8] || "").trim())
  .filter(Boolean);

const employeeStoreMap = new Map();

kbRows.forEach((row) => {
  const name = String(row[8] || "").trim();

  const store = String(
    row[34] || ""
  )
    .trim()
    .toUpperCase();

  if (name) {
    employeeStoreMap.set(
      name,
      store
    );
  }
});

console.log(
  "NV MỚI 1 STORE",
  employeeStoreMap.get(
    "Nhân viên Mới 1"
  )
);

console.log(
  "NV MỚI 2 STORE",
  employeeStoreMap.get(
    "Nhân viên Mới 2"
  )
);
kbRows.forEach((row) => {
  if (
    String(row[8] || "").includes("Nhân viên")
  ) {
    console.log(
      "NEW STAFF ROW",
      row[8],
      "STORE=",
      row[34]
    );
  }
});
const dmlEmployees = employees.filter(
  (e: any) =>
    employeeStoreMap.get(
      e.name
    ) === "DML"
);

const tgddEmployees = employees.filter(
  (e: any) =>
    employeeStoreMap.get(
      e.name
    ) === "TGDD"
);

return NextResponse.json({
  success: true,

  dmlResults,
  tgddResults,

  dmlEmployees,
  tgddEmployees,
});
    } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}
