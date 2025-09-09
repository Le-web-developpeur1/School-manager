import { useEffect, useState } from "react";
import { getRepartitionModesPaiement } from "../../services/paiementsService";
import { CreditCard } from "lucide-react"; // Icône sympa

interface ModePaiement {
  mode: string;
  montant: number;
}

const BlocModesPaiement = () => {
  const [modes, setModes] = useState<ModePaiement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const charger = async () => {
      const data = await getRepartitionModesPaiement();
      setModes(data);
      setLoading(false);
    };
    charger();
  }, []);

  const total = modes.reduce((sum, m) => sum + m.montant, 0);

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-3">
      <h3 className="text-md font-semibold mb-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded">
        📌 Modes de paiement
      </h3>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement...</p>
      ) : modes.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun paiement enregistré.</p>
      ) : (
        <ul className="space-y-3">
          {modes.map(({ mode, montant }) => {
            const pourcentage = total > 0 ? (montant / total) * 100 : 0;
            return (
              <li
                key={mode}
                className="p-3 rounded-lg border hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{mode}</span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    {montant.toLocaleString()} GNF ({pourcentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
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

export default BlocModesPaiement;
