import { useEffect, useState } from "react";
import { listerPaiements } from "../../services/paiementsService";
import { Receipt } from "lucide-react";

type Paiement = {
  id: string;
  montant: number;
  mois: string;
  motif: string;
  datePaiement: string;
  eleve: {
    _id: string;
    nom: string;
    prenom: string;
  };
};

const PaiementsRecents = () => {
  const [paiements, setPaiements] = useState<Paiement[]>([]);

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await listerPaiements({ limit: 5 });
        setPaiements(data);
      } catch (error) {
        console.error("Erreur chargement paiements :", error);
      }
    };

    charger();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 h-[340px] flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Receipt className="w-5 h-5 text-indigo-600" />
        <h2 className="text-md font-semibold text-gray-800">Paiements récents</h2>
      </div>

      <div className="overflow-x-auto overflow-y-auto flex-grow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-indigo-50 text-left text-gray-600">
              <th className="px-4 py-2">Élève</th>
              <th className="px-4 py-2">Montant</th>
              <th className="px-4 py-2">Mois</th>
              <th className="px-4 py-2">Motif</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {paiements.map((p: Paiement, idx) => (
              <tr
                key={p.id || p._id}
                className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-100 transition`}
              >
                <td className="px-4 py-2 text-gray-800">
                  {p.eleve?.nom + " " + p.eleve?.prenom || "—"}
                </td>
                <td className="px-4 py-2">
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-semibold">
                    {p.montant.toLocaleString()} GNF
                  </span>
                </td>
                <td className="px-4 py-2">{p.mois}</td>
                <td className="px-4 py-2">
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">
                    {p.motif}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {new Date(p.datePaiement).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaiementsRecents;
