import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type NiveauData = Record<string, number>;

const generateColors = (count: number) =>
  Array.from({ length: count }, (_, i) =>
    `hsl(${(i * 360) / count}, 70%, 60%)`
  );

const NiveauPieChart = ({ data }: { data?: NiveauData }) => {
  const labels = Object.keys(data ?? {});
  const values = Object.values(data ?? {}).map(v => Number(v ?? 0));

  const isLoading = !data;
  const hasData = labels.length > 0 && values.some(v => v > 0);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: generateColors(labels.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#374151",
          boxWidth: 14,
          padding: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${ctx.raw} élève(s)`
        }
      }
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-[220px] w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        📚 Répartition par niveau
      </h2>
      <div className="h-[160px]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-400"></div>
          </div>
        ) : hasData ? (
          <Pie data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            Aucune donnée disponible pour le moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default NiveauPieChart;
