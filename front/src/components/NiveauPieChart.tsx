import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    plugins
} from 'chart.js';
  
ChartJS.register(ArcElement, Tooltip, Legend);

const NiveauPieChart = ({ data }) => {
    const labels = Object.keys(data);
    const values = Object.values(data);

    const chartData = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legen: { position: 'bottom'},
        },
    };
    return (
        <div className="bg-white p-4 rounded shadow-md h-[220px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">📚 Répartition par niveau</h2>
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default NiveauPieChart;