import React from "react";
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const RepartitionSexe = ({ data }) => {
    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                data: Object.values(data),
                backgroundColor: ['#ec4899', '#60a5fa'],
                borderWidth: 1
            },
        ],
    };

    const options = {
        response: true,
        plugins: {
            legend: { 
                position: 'left', 
                labels: {
                    padding: 20
                },
            },
        },
    };

    return (
        <div className="bg-white p-3 rounded shadow-md mt-14 h-[220px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">👫 Sexe</h2>
            <Pie data={chartData} options={options} />
        </div>

    );
};

export default RepartitionSexe;