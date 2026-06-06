

export const revalidate = 30;

async function getDashboard() {
  const res = await fetch(
    "http://localhost:3000/api/dashboard",
    {
      cache: "no-store",
    }
  );

  return res.json();

}

async function getBanKem() {
  const res = await fetch(
    "http://localhost:3000/api/bankem",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function Home() {
  const data = await getDashboard();
  const bankem = await getBanKem();

  const thiDuaRes = await fetch(
    "http://localhost:3000/api/thidua",
    {
      cache: "no-store",
    }
  );

  const thiDua =
    await thiDuaRes.json();

  const thiDuaGroups =
    thiDua.groups || [];

 const thiDuaData =
  thiDua.employeeThiDua || [];

const thiDuaDetails =
  thiDua.employeeDetails || [];

const thiDuaDML =
  data.thiDuaDML || [];

const thiDuaTGDD =
  data.thiDuaTGDD || [];
  
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        📊 Dashboard Hiệu Quả Nhân Viên
      </h1>

      {/* KPI TỔNG */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 rounded-xl p-4">
          <div className="text-slate-400">
            TARGET
          </div>
          <div className="text-3xl font-bold">
            {data.summary.totalTarget.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4">
          <div className="text-slate-400">
            DTQD
          </div>
          <div className="text-3xl font-bold">
            {data.summary.totalDTQD.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4">
          <div className="text-slate-400">
            % Hoàn Thành Dự Kiến
          </div>
          <div className="text-3xl font-bold">
            {data.summary.totalPercent.toFixed(1) + "%".toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4">
          <div className="text-slate-400">
            % Trả Chậm
          </div>
          <div className="text-3xl font-bold text-green-400">
            {data.summary.totalTraCham.toFixed(2) + "%"}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-slate-900 rounded-xl p-5 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            📈 Hiệu Quả Ngành Hàng
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <h3 className="text-4xl font-bold text-cyan-400 mb-3">
  DML Thanh Châu
</h3>

<div className="grid grid-cols-6 gap-4 mb-4">

  <div>
    <div className="text-slate-400 text-sm">
      DTQĐ
    </div>
    <div className="font-bold text-3xl">
      {data.dmlTotal.dtqd}
    </div>
  </div>

  <div>
    <div className="text-slate-400 text-sm">
      Target
    </div>
    <div className="font-bold text-3xl">
      {data.dmlTotal.target.toLocaleString()}
    </div>
  </div>

  <div>
    <div className="text-slate-400 text-sm">
      % HT DK
    </div>
    <div
  className={`font-bold text-3xl ${
    data.dmlTotal.projectedPercent >= 100
      ? "text-green-400"
      : "text-red-400"
  }`}
>
  {data.dmlTotal.projectedPercent.toFixed(1)}%
</div>
  </div>

  <div>
    <div className="text-slate-400 text-sm">
      Cùng kỳ
    </div>
    <div
      className={`font-bold text-3xl ${
        data.dmlTotal.dtck >= 0
          ? "text-green-400"
          : "text-red-400"
      }`}
    >
      {(data.dmlTotal.dtck * 100).toFixed(0)}%
    </div>
  </div>

  <div>
    <div className="text-slate-400 text-sm">
      GTĐH
    </div>
    <div className="font-bold text-3xl">
      {data.stores[0]?.gtdh}
    </div>
  </div>

  <div>
    <div className="text-slate-400 text-sm">
      Trả chậm
    </div>
    <div
      className={`font-bold text-3xl ${
        data.stores[0]?.traChamPercent >= 15
          ? "text-green-400"
          : "text-red-400"
      }`}
    >
      {data.stores[0]?.traChamPercent.toFixed(2)}%
    </div>
  </div>

</div>
             <table className="w-full text-lg">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2">Ngành</th>

<th className="text-right py-2">
  DTQĐ
</th>

<th className="text-right py-2">
  Target
</th>

<th className="text-right py-2">
  % HT
</th>

<th className="text-right py-2">
  Cùng kỳ
</th>
                  </tr>
                </thead>

                <tbody>
                  {data.industryDML
                    .slice(1)
                    .map((item: any) => (
                      <tr
                        key={item.nganh}
                        className="border-b border-slate-800"
                      >
                        <td>{item.nganh}</td>

<td className="text-right">
  {Number(item.dtqd).toLocaleString()}
</td>

<td className="text-right">
  {Number(item.target).toLocaleString()}
</td>

<td
  className={`text-right font-bold ${
    item.percent >= 1
      ? "text-green-400"
      : item.percent >= 0.8
      ? "text-yellow-400"
      : "text-red-400"
  }`}
>
  {(item.percent * 100).toFixed(0)}%
</td>

<td
  className={`text-right font-bold ${
    item.dtck >= 0
      ? "text-green-400"
      : "text-red-400"
  }`}
>
  {(item.dtck * 100).toFixed(0)}%
</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-yellow-400 mb-3">
  TGDD Đinh Tiên Hoàng
</h3>

<div className="grid grid-cols-6 gap-6 mb-5">

  <div>
    <div className="text-slate-400 text-xs">
      DTQĐ
    </div>
    <div className="font-bold text-3xl">
      {data.tgddTotal.dtqd}
    </div>
  </div>

  <div>
    <div className="text-slate-400 text-sm">
      Target
    </div>
    <div className="font-bold text-3xl">
      {data.tgddTotal.target.toLocaleString()}
    </div>
  </div>

  <div>
    <div className="text-slate-400 text-sm">
      % HT DK
    </div>
    <div
  className={`font-bold text-3xl ${
    data.tgddTotal.projectedPercent >= 100
      ? "text-green-400"
      : "text-red-400"
  }`}
>
  {data.tgddTotal.projectedPercent.toFixed(1)}%
</div>
  </div>

  <div>
    <div className="text-slate-400 text-sm">
      Cùng kỳ
    </div>
    <div
      className={`font-bold text-3xl ${
        data.tgddTotal.dtck >= 0
          ? "text-green-400"
          : "text-red-400"
      }`}
    >
      {(data.tgddTotal.dtck * 100).toFixed(0)}%
    </div>
  </div>

  <div>
    <div className="text-slate-400 text-sm">
      GTĐH
    </div>
    <div className="font-bold text-3xl">
      {data.stores[1]?.gtdh}
    </div>
  </div>

  <div>
    <div className="text-slate-400 text-sm">
      Trả chậm
    </div>
    <div
      className={`font-bold text-3xl ${
        data.stores[1]?.traChamPercent >= 15
          ? "text-green-400"
          : "text-red-400"
      }`}
    >
      {data.stores[1]?.traChamPercent.toFixed(2)}%
    </div>
  </div>

</div>
              <table className="w-full text-lg">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2">Ngành</th>

<th className="text-right py-2">
  DTQĐ
</th>

<th className="text-right py-2">
  Target
</th>

<th className="text-right py-2">
  % HT
</th>

<th className="text-right py-2">
  Cùng kỳ
</th>
                  </tr>
                </thead>

                <tbody>
                  {data.industryTGDD
                    .slice(1)
                    .map((item: any) => (
                      <tr
                        key={item.nganh}
                        className="border-b border-slate-800"
                      >
                        <td>{item.nganh}</td>


<td className="text-right">
  {Number(item.dtqd).toLocaleString()}
</td>

<td className="text-right">
  {Number(item.target).toLocaleString()}
</td>

<td
  className={`text-right font-bold ${
    item.percent >= 1
      ? "text-green-400"
      : item.percent >= 0.8
      ? "text-yellow-400"
      : "text-red-400"
  }`}
>
  {(item.percent * 100).toFixed(0)}%
</td>

<td
  className={`text-right font-bold ${
    item.dtck >= 0
      ? "text-green-400"
      : "text-red-400"
  }`}
>
  {(item.dtck * 100).toFixed(0)}%
</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
        </div>
        
          <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* TOP DTQD */}
        <div className="bg-slate-900 rounded-xl p-4 mb-6">
          <h2 className="font-bold text-xl mb-4">
            🏆 Top DTQĐ
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2">
                  Nhân viên
                </th>

                <th className="text-left py-2">
                  Cửa hàng
                </th>

                <th className="text-right py-2">
                  DTQĐ
                </th>

                

                <th className="text-right py-2">
                  GTĐH
                </th>
              </tr>
            </thead>

            <tbody>
              {data.topEmployees.map(
                (nv: any, index: number) => (
                  <tr
                    key={nv.name}
                    className="border-b border-slate-800"
                  >
                    <td className="py-2">
                      #{index + 1} {nv.name}
                    </td>

                    <td>
                      {nv.store}
                    </td>

                    <td className="text-right">
                      {nv.dtqd.toLocaleString()}
                    </td>

                    

                    <td className="text-right font-bold text-cyan-400">
                      {nv.dongia}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {/* TOP TRẢ CHẬM */}
        <div className="bg-slate-900 rounded-xl p-4 mb-6">
          <h2 className="font-bold text-xl mb-4">
            🏦 Top Trả Chậm
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2">
                  Nhân viên
                </th>

                <th className="text-left py-2">
                  Cửa hàng
                </th>

                <th className="text-right py-2">
                  Trả chậm
                </th>

                <th className="text-right py-2">
                  %
                </th>
              </tr>
            </thead>

            <tbody>
              {data.topTraCham?.map(
                (nv: any, index: number) => (
                  <tr
                    key={nv.name}
                    className="border-b border-slate-800"
                  >
                    <td className="py-2">
                      #{index + 1} {nv.name}
                    </td>

                    <td>
                      {nv.store}
                    </td>

                    <td className="text-right">
                      {Number(
                        nv.traCham || 0
                      ).toLocaleString()}
                    </td>

                    <td
                      className={`text-right font-bold ${nv.tyLeTraCham >= 30
                          ? "text-green-400"
                          : "text-red-400"
                        }`}
                    >
                      {Number(
                        nv.tyLeTraCham || 0
                      ).toFixed(1)}
                      %
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        </div>
<div className="grid md:grid-cols-2 gap-4 mb-6">

  <div className="bg-slate-900 rounded-xl p-4">
    <h2 className="font-bold text-3xl mb-3 text-cyan-400">
  🏪 Thi Đua DML (
  {
    thiDuaDML.filter(
      (x: any) => x.htdk >= 100
    ).length
  }
  /
  {thiDuaDML.length}
  )
</h2>

    <table className="w-full text-xl">
      <thead>
        <tr className="border-b border-slate-700">
          <th className="text-left">Nhóm hàng</th>
<th className="text-right">Target</th>
<th className="text-right">Lũy kế</th>
<th className="text-right">%HTDK</th>
        </tr>
      </thead>

      <tbody>
        {[...thiDuaDML]
  .sort((a: any, b: any) => {
    if (
      a.flag === "VIP" &&
      b.flag !== "VIP"
    )
      return -1;

    if (
      a.flag !== "VIP" &&
      b.flag === "VIP"
    )
      return 1;

    return 0;
  })
  .map((item: any, index: number) => (
          <tr
            key={index}
            className="border-b border-slate-800"
          >
            <td>  {item.flag === "VIP" ? "⭐ " : ""}
  {item.nganh}</td>

<td className="text-right">
  {Number(item.target).toFixed(0)}
</td>

<td className="text-right">
  {Number(item.luyKe).toFixed(0)}
</td>

<td
  className={`text-right font-bold ${
    item.htdk >= 100
      ? "text-green-400"
      : "text-red-400"
  }`}
>
  {Number(item.htdk).toFixed(1)}%
</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="bg-slate-900 rounded-xl p-4">
    <h2 className="font-bold text-3xl mb-3 text-yellow-400">
  🏪 Thi Đua TGDD (
  {
    thiDuaTGDD.filter(
      (x: any) => x.htdk >= 100
    ).length
  }
  /
  {thiDuaTGDD.length}
  )
</h2>

    <table className="w-full text-xl">
      <thead>
        <tr className="border-b border-slate-700">
          <th className="text-left">Nhóm hàng</th>
<th className="text-right">Target</th>
<th className="text-right">Lũy kế</th>
<th className="text-right">%HTDK</th>
        </tr>
      </thead>

      <tbody>
        {[...thiDuaTGDD]
  .sort((a: any, b: any) => {
    if (
      a.flag === "VIP" &&
      b.flag !== "VIP"
    )
      return -1;

    if (
      a.flag !== "VIP" &&
      b.flag === "VIP"
    )
      return 1;

    return 0;
  })
  .map((item: any, index: number) => (
          <tr
            key={index}
            className="border-b border-slate-800"
          >
           <td>
  {item.flag === "VIP" ? "⭐ " : ""}
  {item.nganh}
</td>

<td className="text-right">
  {Number(item.target).toFixed(0)}
</td>

<td className="text-right">
  {Number(item.luyKe).toFixed(0)}
</td>

<td
  className={`text-right font-bold ${
    item.htdk >= 100
      ? "text-green-400"
      : "text-red-400"
  }`}
>
  {Number(item.htdk).toFixed(1)}%
</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

</div>
        {/* THI ĐUA NHÂN VIÊN */}

        <div className="bg-slate-900 rounded-xl p-4 mb-6 overflow-auto">
          <h2 className="font-bold text-xl mb-4">
            🏆 Thi Đua Nhân Viên
          </h2>

          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="sticky left-0 bg-slate-900 text-left px-2 py-2">
                  Nhân viên
                </th>

                {thiDuaGroups.map(
                  (group: string) => (
                    <th
                      key={group}
                      className="px-2 py-2 text-center whitespace-nowrap"
                    >
                      {group}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {thiDuaData.map(
                (nv: any) => (
                  <tr
                    key={nv.name}
                    className="border-b border-slate-800"
                  >
                    <td className="sticky left-0 bg-slate-900 px-2 py-2 whitespace-nowrap">
                      {nv.name}
                    </td>

                    {thiDuaGroups.map(
                      (group: string) => {
                        const value =
                          Number(
                            nv[group] || 0
                          );

                        return (
                          <td
                            key={group}
                            className={`text-center px-2 py-2 font-bold ${value >= 100
                                ? "text-green-400"
                                : value >= 80
                                  ? "text-yellow-400"
                                  : value > 0
                                    ? "text-red-400"
                                    : "text-slate-600"
                              }`}
                          >
                            {value > 0
                              ? `${value}%`
                              : "-"}
                          </td>
                        );
                      }
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

<div className="bg-slate-900 rounded-xl p-4 mb-6">
  <h2 className="font-bold text-xl mb-4">
    📋 Chi Tiết Thi Đua Nhân Viên
  </h2>

  <div className="grid grid-cols-6 gap-2">

    {thiDuaData.map((nv: any) => {

      const details = thiDuaDetails.filter(
        (x: any) => x.nhanVien === nv.name
      );

      return (
        <div
          key={nv.name}
          className="bg-slate-950 rounded-lg p-3 border border-slate-800"
        >
          <div className="font-bold text-cyan-400 text-sm mb-2">
            {nv.name.split("-")[0]}
          </div>

          <div className="space-y-1 text-xs">

  <div className="grid grid-cols-4 gap-1 text-[10px] text-slate-500 border-b border-slate-800 pb-1 mb-1">
    <div>Nhóm</div>
    <div className="text-right">Target</div>
    <div className="text-right">LK</div>
    <div className="text-right">%HT</div>
  </div>

  {details
  .filter(
    (item: any) =>
      Number(item.target || 0) > 0
  )
  .map(
    (item: any, index: number) => (
      <div
        key={`${item.vietTat}-${index}`}
        className="grid grid-cols-4 gap-1"
      >
        <div className="font-bold text-white">
          {item.vietTat}
        </div>

        <div className="text-right">
          {Number(item.target).toFixed(0)}
        </div>

        <div className="text-right">
          {Number(item.luyKe).toFixed(0)}
        </div>

        <div
          className={`text-right font-bold ${
            item.percent >= 100
              ? "text-green-400"
              : item.percent >= 80
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {Number(item.percent).toFixed(0)}%
        </div>
      </div>
    )
  )}
</div>
        </div>
      );
    })}

  </div>
</div>
        {/* TOÀN BỘ NHÂN VIÊN */}
        <div className="bg-slate-900 rounded-xl p-4">
          <h2 className="font-bold text-xl mb-4">
            👥 Toàn Bộ Nhân Viên
          </h2>

          <table className="w-full text-xl">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2">
                  Nhân viên
                </th>

                <th className="text-left py-2">
                  Cửa hàng
                </th>

                <th className="text-right py-2">
                  DT Thực
                </th>

                <th className="text-right py-2">
                  DTQĐ
                </th>

                <th className="text-right py-2">
                  HQ QĐ
                </th>
<th className="text-right py-2">
  GTĐH
</th>
                <th className="text-right py-2">
                  Trả chậm
                </th>

                <th className="text-right py-2">
                  %HQ TC
                </th>
                <th className="text-right py-2">
                  SL bán
                </th>

                <th className="text-right py-2">
                  SL BK
                </th>

                <th className="text-right py-2">
                  %HQ BK
                </th>
                


              </tr>
            </thead>

            <tbody>
              {data.employees.map((nv: any) => (
                <tr
                  key={nv.name}
                  className="border-b border-slate-800"
                >
                  <td className="py-2">
                    {nv.name}
                  </td>

                  <td>
                    {nv.store}
                  </td>

                  <td className="text-right">
                    {Number(nv.dttt).toLocaleString()}
                  </td>

                  <td className="text-right">
                    {Number(nv.dtqd).toLocaleString()}
                  </td>

                  <td className="text-right font-bold text-cyan-400">
                    {nv.dttt > 0
                      ? (
                        (nv.dtqd /
                          nv.dttt) *
                        100
                      ).toFixed(1)
                      : 0}
                    %
                  </td>
<td className="text-right">
  {Number(nv.dongia || 0).toFixed(2)}
</td>
                  <td className="text-right">
                    {Number(
                      nv.traCham || 0
                    ).toLocaleString()}
                  </td>

                  <td
                    className={`text-right font-bold ${nv.tyLeTraCham >= 30
                        ? "text-green-400"
                        : "text-red-400"
                      }`}
                  >
                    {Number(
                      nv.tyLeTraCham || 0
                    ).toFixed(1)}
                    %
                  </td>
                  <td className="text-right">
                    {nv.slBan || 0}
                  </td>

                  <td className="text-right">
                    {nv.slBanKem || 0}
                  </td>

                  <td
                    className={`text-right font-bold ${nv.tyLeSPBanKem >= 40
                        ? "text-green-400"
                        : nv.tyLeSPBanKem >= 25
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                  >
                    {Number(
                      nv.tyLeSPBanKem || 0
                    ).toFixed(1)}
                    %
                  </td>
                  


                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </main>
  );
}
