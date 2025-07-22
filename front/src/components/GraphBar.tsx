import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJs, BarElement, CategoryScale, LinearScale, Tooltip, Legend, scales } from 'chart.js';

ChartJs.register(BarElement , CategoryScale, LinearScale, Tooltip, Legend);
const GraphBar = ({ data }) => {
    const labels = Object.keys(data);
    const montants = Object.values(data);

    const chartData = {
        labels,
        datasets: [
           { 
            label: 'Encaissements (GNF)',
            data: montants,
            backgroundColor: '#3b82f6',
            borderRadius: 4,
        }
        ],
    }

    const options = {
        responsive: true,
        plugins:{
            legend: {
                display: true,
                position: 'top'
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => value.toLocaleString(),
                },
            },
        },
    };

    return (
        <div className="bg-white p-3 rounded shadow-md h-[226px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">📊 Encaissements Mensuels</h2>
            <Bar data={chartData} options={options} />
        </div>
    )
};

export default GraphBar;