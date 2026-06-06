"use client";

import { useEffect, useState } from "react";

export default function StramPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/stram-tracking")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="p-6">
        Đang tải dữ liệu...
      </div>
    );
  }

  const renderResultTable = (
    title: string,
    results: any[]
  ) => (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-bold text-xl mb-4">
        {title}
      </h2>

      <table className="w-full text-[10px]">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2 text-left">
              Nhóm
            </th>

            <th className="p-2 text-right">
              Target
            </th>

            <th className="p-2 text-right">
              LK
            </th>

            <th className="p-2 text-right">
              Còn lại
            </th>

            <th className="p-2 text-right">
              %HT DK
            </th>
<th className="p-2 text-right">
              Lựa Chọn
            </th>
            <th className="p-2 text-right">
              Target Tuần
            </th>
          </tr>
        </thead>

        <tbody>
          {results.map(
            (item: any, i: number) => {
              const color =
                item.percentMonth >= 100
                  ? "text-green-600"
                  : item.percentMonth >= 80
                  ? "text-yellow-600"
                  : "text-red-600";

              return (
                <tr
                  key={i}
                  className="border-b"
                >
                  <td className="p-2 font-semibold">
                    {item.shortName}
                  </td>

                  <td className="p-2 text-right">
                    {Math.round(
                      item.targetMonth
                    )}
                  </td>

                  <td className="p-2 text-right">
                    {Math.round(
                      item.actualMonth
                    )}
                  </td>

                  <td className="p-2 text-right">
                    {Math.round(
                      item.remainMonth
                    )}
                  </td>

                  <td
                    className={`p-2 text-right font-bold ${color}`}
                  >
                    {item.percentMonth.toFixed(
                      0
                    )}
                    %
                  </td>
<td className="p-2 text-right">
  <input
    type="checkbox"
    defaultChecked
    className="w-4 h-4"
  />
</td>
                  <td className="p-2 text-right">
  {Math.round(
    Number(item.targetWeek || 0)
  )}
</td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );

  const renderEmployeeCards = (
    title: string,
    employees: any[]
  ) => (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-bold text-xl mb-4">
        {title}
      </h2>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {employees.map(
          (emp: any) => (
            <div
              key={emp.name}
              className="border rounded-lg p-3 bg-slate-50 min-w-[220px] min-h-[460px]"
              
            >
              <div className="font-bold text-[13px] mb-2 leading-4">
                {emp.name}
              </div>

              <div className="mb-2 text-[10px]">
  <div className="border-b pb-2 mb-2">

  <div className="grid grid-cols-[1fr_45px_45px_45px] text-[10px]">
    <span></span>
    <span className="text-right font-bold">TG</span>
    <span className="text-right font-bold">LK</span>
    <span className="text-right font-bold">%HT</span>
  </div>

  <div className="grid grid-cols-[1fr_45px_45px_45px] text-[10px]">
    <span className="font-bold text-red-600">
      DOANH THU
    </span>

    <span className="text-right text-red-600 font-bold">
      {emp.targetDT}
    </span>

    <span className="text-right text-red-600 font-bold">
     {Math.round(emp.actualDT || 0)}
    </span>

    <span className="text-right text-green-600 font-bold">
      {Math.round(emp.percentDT || 0)}%
    </span>
  </div>

  <div className="grid grid-cols-[1fr_45px_45px_45px] text-[10px]">
    <span className="font-bold text-blue-600">
      TRẢ CHẬM
    </span>

    <span className="text-right text-blue-600 font-bold">
      {emp.targetTC}
    </span>

    <span className="text-right text-blue-600 font-bold">
     {Math.round(emp.actualTC || 0)}
    </span>

    <span className="text-right text-green-600 font-bold">
      {Math.round(emp.percentTC || 0)}%
    </span>
  </div>

</div>
</div>



              

              <div className="text-[13px] leading-6 mt-3">
                <div className="grid grid-cols-[18px_1fr_40px_40px_45px] text-[10px] font-bold border-b pb-1 mb-1">
  <span>#</span>
  <span>Nhóm</span>
  <span className="text-right">
    TG
  </span>
  <span className="text-right">
    LK
  </span>
  <span className="text-right">
    %HT
  </span>
</div>
  {emp.groups
  .filter(
    (g: any) =>
      Number(g.target) > 0
  )
  .slice(0, 14)
  .map(
    (
      g: any,
      idx: number
    ) => (
      <div
        key={idx}
        className="grid grid-cols-[18px_1fr_40px_40px_45px] text-[10px] py-[2px]"
      >
        <span>{idx + 1}</span>

        <span className="truncate">
  {g.group}
</span>

        <span className="text-right">
          {g.target}
        </span>

        <span className="text-right font-semibold text-blue-600">
          {g.actual}
        </span>

        <span
          className={`text-right font-semibold ${
            g.percent >= 100
              ? "text-green-600"
              : g.percent >= 80
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {g.percent.toFixed(0)}%
        </span>
      </div>
    )
  )}
</div>
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-slate-100 min-h-screen">

      {/* DML */}
      <div className="mb-8">
        <div className="bg-blue-700 text-white font-bold text-lg px-4 py-2 rounded-t-xl">
          THEO DÕI KQ TUẦN DML
        </div>

        <div className="grid grid-cols-[20%_80%] gap-2 mt-2">
          {renderResultTable(
            "KQ THI ĐUA DML",
            data.dmlResults
          )}

          {renderEmployeeCards(
            "MỤC TIÊU STRAM NV_DML",
            data.dmlEmployees
          )}
        </div>
      </div>

      {/* TGDD */}
      <div>
        <div className="bg-green-700 text-white font-bold text-lg px-4 py-2 rounded-t-xl">
          THEO DÕI KQ TUẦN TGDD
        </div>

        <div className="grid grid-cols-[20%_80%] gap-2 mt-2">
          {renderResultTable(
            "KQ THI ĐUA TGDD",
            data.tgddResults
          )}

          {renderEmployeeCards(
            "MỤC TIÊU STRAM NV_TGDD",
            data.tgddEmployees
          )}
        </div>
      </div>

    </div>
  );
}