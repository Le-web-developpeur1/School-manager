import { useEffect, useState } from 'react';
import { Banknote, Calendar, ClipboardList } from 'lucide-react';
import { listerPaiements } from '../../services/paiementsService';

const VueSynthese = () => {
    const [totalMontant, setTotalMontant] = useState(0);
    const [nombrePaiements, setNombrePaiements] = useState(0);
    const [montantMois, setMontantMois] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const chargerStats = async () => {
            try {
                const paiements = await listerPaiements();
                const maintenant = new Date();
                const moisActuel = maintenant.getMonth();
                const anneeActuelle = maintenant.getFullYear();

                let total = 0;
                let totalMois = 0;

                paiements.forEach((p: any) => {
                    total += p.montant;
                    const date = new Date(p.datePaiement);
                    if (date.getMonth() === moisActuel && date.getFullYear() === anneeActuelle) {
                        totalMois += p.montant;
                    }
                });
                setTotalMontant(total);
                setMontantMois(totalMois);
                setNombrePaiements(paiements.length);
            } catch (error) {
                console.error("Erreur chargement stats :", error);
                setLoading(false);
            }
        };
        
        chargerStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-white shadow-sm p-4 dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
              <Banknote className="text-green-600" />
              <span>Montant total encaissé</span>
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {loading ? "Chargement..." : `${totalMontant.toLocaleString()} GNF`}
            </div>
          </div>
    
          <div className="rounded-lg border bg-white shadow-sm p-4 dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
              <Calendar className="text-blue-600" />
              <span>Encaissement ce mois</span>
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {loading ? "Chargement..." : `${montantMois.toLocaleString()} GNF`}
            </div>
          </div>
    
          <div className="rounded-lg border bg-white shadow-sm p-4 dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
              <ClipboardList className="text-purple-600" />
              <span>Nombre de paiements</span>
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {loading ? "Chargement..." : nombrePaiements}
            </div>
          </div>
        </div>
      );
};
    
export default VueSynthese;