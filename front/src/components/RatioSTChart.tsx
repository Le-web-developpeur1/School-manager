import Redact from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const RatioSTChart = ({ data }) => {
    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                data: Object.values(data),
                backgroundColor: ['#3b82f6', '#10b981'],
                borderWidth: 1
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { 
                position: 'right',
                labels: {
                    padding: 20,
                    marginLeft: 10
                },
            },
        },
    };

    return (
        <div className="bg-white p-5 rounded shadow-md mt-14 h-[220px]">
            <h2 className="text-lg font-semibold text-gray-700">🎓 Ratio Élèves / Enseignants</h2>
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default RatioSTChart;