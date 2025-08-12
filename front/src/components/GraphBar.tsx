import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJs,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJs.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Item = {
  mois?: string;
  label?: string;
  montant?: number;
  value?: number;
};

const GraphBar = ({ data }: { data?: Item[] | { items?: Item[] } }) => {
  const rows = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
    ? data.items
    : [];

  const hasData = rows.length > 0;

  const labels = rows.map((item) => item.mois ?? item.label ?? '');
  const montants = rows.map((item) => Number(item.montant ?? item.value ?? 0));

  const backgroundColors = montants.map((val) => {
    const intensity = Math.min(255, Math.floor((val / Math.max(...montants)) * 255));
    return `rgba(${255 - intensity}, ${intensity}, 246, 0.8)`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Encaissements mensuels',
        data: montants,
        backgroundColor: backgroundColors,
        borderRadius: 6,
        barThickness: 20,
        maxBarThickness: 24,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
      x: { ticks: { color: '#374151' }, grid: { color: '#e5e7eb' } },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#374151' },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.raw} GNF`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[340px] w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
        📊 <span>Encaissements Mensuels</span>
      </h2>
      <div className="h-[260px]">
        {hasData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Aucune donnée disponible.
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphBar;
