import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJs, BarElement, CategoryScale, LinearScale, Tooltip, Legend, scales } from 'chart.js';

ChartJs.register(BarElement , CategoryScale, LinearScale, Tooltip, Legend);
const GraphBar = ({ data }) => {
    const labels = data.map(item => item.mois);
    const montants = data.map(item => item.montant);

    const chartData = {
        labels,
        datasets: [
          {
            label: "Encaissements mensuels",
            data: montants,
            backgroundColor: "#3b82f6"
          }
        ]
      };
      const options = {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };
      
    console.log("Labels:", labels);
    console.log("Montants:", montants);


    return (
        <div className="bg-white p-3 rounded shadow-md h-[220px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">📊 Encaissements Mensuels</h2>
            <Bar data={chartData} options={options} />
        </div>
    )
};

export default GraphBar;