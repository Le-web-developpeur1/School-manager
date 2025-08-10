import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, plugins } from "chart.js";
import { getElevesParClasse } from './../services/statsService';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const GraphElevesParClasse = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getElevesParClasse();
                setData(res.data);
            } catch (error) {
                console.error("Erreur de chargement des statistiques élèves/classes", error);
            }
        };
        fetchStats();
    }, []);

    const labels = data.map(item => item.nomClasse);
    const values = data.map(item => item.total);

    const chartData = {
        labels,
        datasets: [
            {
                lable: "Nombre d'élèves par classe",
                data: values,
                backgroundColor: "#10b981"
            }
        ]
    };

    const options = {
        responsive: true,
        indexAxis: "y",
        plugins: {
            legend: { position: 'top' }
        },
        scales: {
            x: { beginAtZero: true }
        }
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-md h-fit w-full">
            <h2 className="text-lg font-bold mb-2 text-gray-700">📚 Répartion des Élèves par classe</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default GraphElevesParClasse;