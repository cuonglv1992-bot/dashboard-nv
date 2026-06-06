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




   const sheet =
  workbook.Sheets["XL_DT_TD"];

const rows: any[][] =
  XLSX.utils.sheet_to_json(sheet, {
    header: 1,
  });
console.log(
  "ROW SAMPLE",
  rows[1]
);

const employeeWeekMap = new Map();

rows.slice(1).forEach((r) => {
  const employee = String(r[4] || "").trim(); // E
  const shortName = String(r[3] || "").trim(); // D

  if (!employee.includes("-")) return;

  if (!employeeWeekMap.has(employee)) {
    employeeWeekMap.set(employee, {
      actualDT: 0,
      actualTC: 0,
      percentDT: 0,
      percentTC: 0,
    });
  }

  const item = employeeWeekMap.get(employee);

  if (shortName === "DT") {
    item.actualDT = Number(r[18] || 0);
    item.percentDT = Number(r[19] || 0) * 100;
  }

  if (shortName === "TC") {
    item.actualTC = Number(r[18] || 0);
    item.percentTC = Number(r[19] || 0) * 100;
  }
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
console.log(
  "KB SAMPLE",
  kbRows.slice(0,20)
);
console.log(
  kbRows
    .slice(0,20)
    .map((r) => [
      r[8],
      r[9],
      r[10]
    ])
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
    store: String(
      row[34] || ""
    )
      .trim()
      .toUpperCase(),
  }
);
});



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

const groupMap = new Map();
const fullNameToShortName = new Map();

kbRows.forEach((row) => {
  const shortName = String(
    row[3] || ""
  ).trim();
const fullName = String(
  row[2] || ""
).trim();

fullNameToShortName.set(
  fullName,
  shortName
);
  groupMap.set(
    shortName,
    {
      fullName: String(
        row[2] || ""
      ).trim(),

      flag: String(
        row[4] || ""
      ).trim(),

      store: String(
        row[34] || ""
      ).trim(),
    }
  );
});
   const data = rows
  .slice(1)
  .filter(
    (r) =>
      stramGroups.includes(
        String(r[3] || "").trim()
      )
  )
  .filter(
    (r) =>
      r[4] &&
      String(r[4]).trim() !== "Tổng"
  )
  .map((r) => ({
    groupName: String(r[2] || "").trim(),   // C

    shortName: String(r[3] || "").trim(),   // D

    employee: String(r[4] || "").trim(),    // E

    targetWeek: Number(r[12] || 0),         // M

    actualWeek: Number(r[18] || 0),         // S

    percentWeek: Number(r[19] || 0),        // T
  }));

  console.log(
  "EMPLOYEE SAMPLE",
  data.slice(0,20).map(
    x => x.employee
  )
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
console.log(
  "DML GROUPS",
  dmlResults.map(
    (x) => x.shortName
  )
);
const dmlShortNames =
  dmlResults
    .map((x) =>
      fullNameToShortName.get(
        x.shortName
      )
    )
    .filter(Boolean);
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

console.log(
  "TGDD GROUPS",
  tgddResults.map(
    (x) => x.shortName
  )
);
const tgddShortNames =
  tgddResults
    .map((x) =>
      fullNameToShortName.get(
        x.shortName
      )
    )
    .filter(Boolean);
    const employeeMap =
      new Map();
console.log(
  "DML SHORT",
  dmlShortNames
);

console.log(
  "TGDD SHORT",
  tgddShortNames
);
    data.forEach((item) => {
      const targetInfo =
  employeeTargetMap.get(
    item.employee
  );

const store =
  targetInfo?.store || "";

if (
  store === "DML" &&
  !dmlShortNames.includes(
    item.shortName
  )
) {
  return;
}

if (
  store === "TGDD" &&
  !tgddShortNames.includes(
    item.shortName
  )
) {
  return;
}
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

  target: Math.round(
    item.targetWeek
  ),

  actual: Math.round(
    item.actualWeek
  ),

  percent: Number(
    item.percentWeek || 0
  ),
});

}); // đóng data.forEach
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
    store: "",
  };
  const weekInfo =
  employeeWeekMap.get(
    emp.name
  ) || {};
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

  store: targetInfo.store,

  targetDT: targetInfo.dt,
  targetTC: targetInfo.tc,

  actualDT:
    weekInfo.actualDT || 0,

  actualTC:
    weekInfo.actualTC || 0,

  percentDT:
    weekInfo.percentDT || 0,

  percentTC:
    weekInfo.percentTC || 0,

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
  

const dmlEmployees =
  employees.filter(
    (e: any) =>
      e.store === "DML"
  );

const tgddEmployees =
  employees.filter(
    (e: any) =>
      e.store === "TGDD"
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
