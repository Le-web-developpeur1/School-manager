import { useEffect, useState } from "react";
import { listerPaiements } from '../../services/paiementsService';

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
                const data = await listerPaiements({ limit: 5});
                setPaiements(data);
            } catch (error) {
                console.error('Erreur chargement paiements :', error);
            }
        };
        
        charger();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Paiements récents</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Élève</th>
                  <th className="px-4 py-2">Montant</th>
                  <th className="px-4 py-2">Mois</th>
                  <th className="px-4 py-2">Motif</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {paiements.map((p: Paiement) => (
                  <tr key={p._id} className="border-t">
                    <td className="px-4 py-2">{p.eleve?.nom + " " + p.eleve?.prenom || '—'}</td>
                    <td className="px-4 py-2">{p.montant.toLocaleString()} GNF</td>
                    <td className="px-4 py-2">{p.mois}</td>
                    <td className="px-4 py-2">{p.motif}</td>
                    <td className="px-4 py-2">{new Date(p.datePaiement).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    );
};

export default PaiementsRecents;