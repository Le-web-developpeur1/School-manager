import { useEffect, useState } from "react";
import { getEncaissementsParMois } from "../../services/statsService";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Loader2 } from "lucide-react";

type Encaissement = {
  mois: string;
  montant: number;
};

export default function EncaissementMensuels() {
  const [data, setData] = useState<Encaissement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchEncaissements = async () => {
        try {
            const res = getEncaissementsParMois();
            setData(res.data);
            setLoading(false)
        } catch (error) {
            console.error("Erreur affichage encaissements :", error);
            setLoading(false);
        }
      };

      fetchEncaissements();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500 w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Encaissements Mensuels
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mois" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value.toLocaleString()} GNF`} />
          <Bar dataKey="montant" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
