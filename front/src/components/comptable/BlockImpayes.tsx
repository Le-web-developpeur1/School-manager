import { useEffect, useState } from "react";
import { getImpayes } from "../../services/paiementsService";
import { AlertTriangle } from "lucide-react";

interface Eleve {
  _id: string;
  nom: string;
  prenom: string;
  matricule?: string;
}

const BlocImpayes = () => {
  const [impayes, setImpayes] = useState<Eleve[]>([]);
  const [total, setTotal] = useState(0);
  const [mois, setMois] = useState("");
  const [anneeScolaire, setAnneeScolaire] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getImpayes();
        if (data) {
          setImpayes(data.liste || []);
          setTotal(data.totalImpayes || 0);
          setMois(data.moisActuel || "");
          setAnneeScolaire(data.anneeScolaire || "");
        }
      } catch (error) {
        console.error("Erreur chargement impayés:", error);
        setImpayes([]);
        setTotal(0);
        setMois("");
        setAnneeScolaire("");
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-3">
      <h3 className="text-md font-semibold mb-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded">
        📌 Impayés – {mois} {anneeScolaire}
      </h3>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement...</p>
      ) : total === 0 ? (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <span>✅</span>
          <span>Aucun impayé pour ce mois</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-red-600 text-sm mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {total} élève{total > 1 && "s"} en retard de paiement
            </span>
          </div>

          <ul className="space-y-2 text-sm text-gray-700">
            {impayes.slice(0, 5).map((e) => (
              <li
                key={e._id}
                className="flex justify-between items-center p-2 rounded border hover:shadow-sm transition"
              >
                <span>
                  {e.nom} {e.prenom}
                </span>
                {e.matricule && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    {e.matricule}
                  </span>
                )}
              </li>
            ))}
          </ul>

          {impayes.length > 5 && (
            <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline">
              Voir plus...
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default BlocImpayes;
