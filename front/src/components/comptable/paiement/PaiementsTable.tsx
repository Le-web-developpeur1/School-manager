import { useEffect, useState } from "react";
import { listerPaiements } from "../../../services/paiementsService";
import toast from "react-hot-toast";
import { Search, X } from "lucide-react";

type Paiement = {
  _id: string;
  eleve?: { nom: string; prenom: string };
  mois: string;
  montant: number;
  motif: string;
  modePaiement: string;
  datePaiement: string;
  statut?: string;
};

const PaiementsTable = () => {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [query, setQuery] = useState("");
  const [filtre, setFiltre] = useState<{ jour?: boolean; semaine?: boolean }>({ jour: true });
  const [currentPage, setCurrentPage] = useState(1);
  const paiementsPerPage = 9;

  const fetchPaiements = async () => {
    try {
      const data = await listerPaiements(filtre);
      setPaiements(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erreur lors du chargement des paiements.");
      setPaiements([]);
    }
  };

  useEffect(() => {
    fetchPaiements();
  }, [filtre]);

  const filtered = paiements
    .filter((p) => p.statut != "Annulé")
    .filter((p) => {
    const nomComplet = `${p.eleve?.nom || ""} ${p.eleve?.prenom || ""}`.toLowerCase();
    return (
      nomComplet.includes(query.toLowerCase()) ||
      p.motif.toLowerCase().includes(query.toLowerCase()) ||
      p.mois.toLowerCase().includes(query.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filtered.length / paiementsPerPage);
  const paginatedPaiements = filtered.slice(
    (currentPage - 1) * paiementsPerPage,
    currentPage * paiementsPerPage
  );

  return (
    <div className="w-full min-h-screen">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">💳 Paiements enregistrés</h2>
            <p className="text-sm text-gray-500">Filtrez les paiements par période ou par élève.</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="px-6 pb-4 flex flex-wrap gap-3 items-center">
          <button
            onClick={() => {
              setFiltre({ jour: true });
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              filtre.jour
                ? "bg-indigo-600 text-white"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
          >
            Paiements du jour
          </button>
          <button
            onClick={() => {
              setFiltre({ semaine: true });
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              filtre.semaine
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Paiements de la semaine
          </button>
          <button
            onClick={() => {
                setFiltre({});
                setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm ${
                !filtre.jour && !filtre.semaine
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            >
            Tous les paiements
         </button>

          {/* Search */}
          <div className="relative w-full sm:max-w-md ml-auto">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Rechercher par élève, mois ou motif…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 pl-9 pr-9 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {!!query && (
              <button
                onClick={() => {
                  setQuery("");
                  setCurrentPage(1);
                }}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                aria-label="Effacer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-left text-gray-600">
                <th className="px-6 py-3">N°</th>
                <th className="px-6 py-3">Élève</th>
                <th className="px-6 py-3">Mois</th>
                <th className="px-6 py-3">Montant</th>
                <th className="px-6 py-3">Motif</th>
                <th className="px-6 py-3">Mode</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedPaiements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-gray-500">
                    Aucun paiement trouvé.
                  </td>
                </tr>
              ) : (
                paginatedPaiements.map((p, index) => (
                  <tr key={p._id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-6 py-3">{(currentPage - 1) * paiementsPerPage + index + 1}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {p.eleve?.nom} {p.eleve?.prenom}
                    </td>
                    <td className="px-6 py-3">{p.mois}</td>
                    <td className="px-6 py-3">{p.montant.toLocaleString()} GNF</td>
                    <td className="px-6 py-3">{p.motif}</td>
                    <td className="px-6 py-3">{p.modePaiement}</td>
                    <td className="px-6 py-3">{new Date(p.datePaiement).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Page <span className="font-medium">{currentPage}</span> / {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50"
              >
                ◀ Précédent
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`rounded-lg border border-gray-300 px-3 py-1.5 text-sm ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50"
              >
                Suivant ▶
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaiementsTable;
