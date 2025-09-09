import { useEffect, useState } from "react";
import { getReparitifionMotifs } from "../../services/statsService";
import { Tag } from "lucide-react"; // Icône sympa

interface MotifData {
  motif: string;
  montant: number;
}

const BlocMotifs = () => {
  const [motifs, setMotifs] = useState<MotifData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getReparitifionMotifs();
        setMotifs(data || []);
      } catch (error) {
        console.error("Erreur chargement motifs :", error);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  const total = motifs.reduce((sum, m) => sum + m.montant, 0);

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-3">
      <h3 className="text-md font-semibold mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-2 rounded">
        📌 Répartition par motif
      </h3>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement...</p>
      ) : motifs.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun paiement enregistré.</p>
      ) : (
        <ul className="space-y-3">
          {motifs.map(({ motif, montant }) => {
            const pourcentage = total > 0 ? (montant / total) * 100 : 0;
            return (
              <li
                key={motif}
                className="p-3 rounded-lg border hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{motif}</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                    {montant.toLocaleString()} GNF
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${pourcentage}%` }}
                  ></div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BlocMotifs;
