import React, { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { getElevesParClasse } from "./../services/statsService";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Item = {
  nomClasse?: string;
  label?: string;
  total?: number;
  value?: number;
};

const GraphElevesParClasse = () => {
  const [rows, setRows] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nf = useMemo(() => new Intl.NumberFormat("fr-FR"), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getElevesParClasse();
        console.log("API response:", res?.data);
        const raw = res?.data;
        const list: Item[] = Array.isArray(raw?.eleves) ? raw.eleves : [];
        if (mounted) setRows(list);
        
      } catch (e) {
        if (mounted) setError("Impossible de charger les élèves par classe.");
        console.error("Erreur de chargement des statistiques élèves/classes", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const labels = rows.map((it) => it.nomClasse ?? it.label ?? "");
  const values = rows.map((it) => Number(it.total ?? it.value ?? 0));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Nombre d'élèves par classe",
        data: values,
        backgroundColor: "#10b981", // emerald-500
        borderRadius: 6,
        barThickness: 18,
        maxBarThickness: 22,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#374151" }, // text-gray-700
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${nf.format(ctx.raw as number)} élève(s)`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#4b5563", // text-gray-600
          callback: (val: any) => nf.format(Number(val)),
        },
        grid: { color: "#e5e7eb" }, // gray-200
      },
      y: {
        ticks: { color: "#4b5563" },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 min-h-[300px] w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        📚 Répartition des élèves par classe
      </h2>

      {loading ? (
        <div className="h-[260px] rounded bg-gray-100 animate-pulse" />
      ) : error ? (
        <div className="h-[260px] flex items-center justify-center rounded bg-red-50 text-red-600">
          {error}
        </div>
      ) : rows.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-gray-500">
          Aucune donnée disponible.
        </div>
      ) : (
        <div className="h-[260px]">
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default GraphElevesParClasse;
