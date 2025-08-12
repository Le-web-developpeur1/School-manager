import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type SexeData = Record<string, number>;

const RepartitionSexe = ({ data }: { data?: SexeData }) => {
  const labels = Object.keys(data ?? {});
  const values = Object.values(data ?? {}).map(v => Number(v ?? 0));
  const hasData = labels.length > 0 && values.some(v => v > 0);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#ec4899", "#60a5fa"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "left" as const,
        labels: {
          color: "#374151",
          padding: 12,
          boxWidth: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${ctx.raw} élève(s)`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-[220px] w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">👫 Répartition par sexe</h2>
      <div className="h-[160px]">
        {hasData ? (
          <Pie data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Aucune donnée disponible.
          </div>
        )}
      </div>
    </div>
  );
};

export default RepartitionSexe;
