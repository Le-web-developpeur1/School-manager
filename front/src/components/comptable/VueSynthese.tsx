import { useEffect, useState } from 'react';
import { Banknote, Calendar, ClipboardList } from 'lucide-react';
import { getStatsGlobal } from '../../services/statsService';

const VueSynthese = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chargerStats = async () => {
      const data = await getStatsGlobal();
      setStats(data);
      setLoading(false);
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
          {loading ? "Chargement..." : `${stats?.montantTotal?.toLocaleString()} GNF`}
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm p-4 dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
          <Calendar className="text-blue-600" />
          <span>Encaissement ce mois</span>
        </div>
        <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {loading ? "Chargement..." : `${stats?.encaissementMois?.toLocaleString()} GNF`}
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm p-4 dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
          <ClipboardList className="text-purple-600" />
          <span>Nombre de paiements</span>
        </div>
        <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {loading ? "Chargement..." : stats?.nombrePaiements}
        </div>
      </div>
    </div>
  );
};

export default VueSynthese;
