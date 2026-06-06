"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function DTQDChart({
  data,
}: {
  data: any[];
}) {
  return (
    <div className="bg-slate-900 rounded-2xl p-4">
      <h2 className="text-xl font-bold mb-4">
        📈 DTQĐ Theo Nhân Viên
      </h2>

      <div className="h-[450px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              angle={-20}
              textAnchor="end"
              height={80}
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="dtqd"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

