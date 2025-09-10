import { useEffect, useState } from "react";
import { listerPaiements, annulerPaiement} from "../../../services/paiementsService";
import { getClasse } from "../../../services/classeService";
import toast from "react-hot-toast";
import { Search, X, Edit, Trash2, FileText } from "lucide-react";
import ModifierPaiementForm from "./ModifierPaiementForm";
import ModalWrapper from "../../modals/ModalWrapper";
import FormPaiement from "./FormPaiement";
import ReleveEleve from "./ReleveEleve";
import StatsClasse from "./StatsClasse";

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
  const [paiementAModifier, setPaiementAModifier] = useState<any | null>(null);
  const [query, setQuery] = useState("");
  const [filtre, setFiltre] = useState<{ jour?: boolean; semaine?: boolean }>({ jour: true });
  const [currentPage, setCurrentPage] = useState(1);
  const paiementsPerPage = 9;
  const [formVisible, setFormVisible] = useState(false);
  const [releveVisible, setReleveVisible] = useState(false);
  const [eleveIdReleve, setEleveIdReleve] = useState<string | null>(null);
  const [classes, setClasses] = useState<{ _id: string; nom: string }[]>([]);
  const [classeSelectionnee, setClasseSelectionnee] = useState<string | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  
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

  useEffect(() => {
    const chargerClasses = async () => {
      const data = await getClasse();
      setClasses(Array.isArray(data) ? data : []);
    };
    chargerClasses();
  }, []);
  
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

  const handleAnnuler = async (id: string) => {
    const confirm = window.confirm("Voulez-vous vraiment annuler ce paiement ?");
    if (!confirm) return;
  
    try {
      await annulerPaiement(id);
      toast.success("Paiement annulé avec succès");
      fetchPaiements(); // recharge la liste
    } catch {
      toast.error("Erreur lors de l'annulation du paiement");
    }
  };

  const totalPages = Math.ceil(filtered.length / paiementsPerPage);
  const paginatedPaiements = filtered.slice(
    (currentPage - 1) * paiementsPerPage,
    currentPage * paiementsPerPage
  );

  return (
    <div className="w-full min-h-screen">
       {paiementAModifier && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <ModifierPaiementForm
                paiement={paiementAModifier}
                onClose={() => setPaiementAModifier(null)}
                onRefresh={fetchPaiements}
              />
            </div>
          </div>
        )}
        {releveVisible && eleveIdReleve && (
          <ModalWrapper onClose={() => setReleveVisible(false)}>
            <ReleveEleve id={eleveIdReleve} />
          </ModalWrapper>
        )}
         {/* Modale pour le formulaire */}
         {formVisible && (
          <ModalWrapper onClose={() => setFormVisible(false)}>
            <FormPaiement
              onClose={() => setFormVisible(false)}
              onSuccess={() => {
                setFormVisible(false);
                // Tu peux recharger la liste des paiements ici si besoin
              }}
            />
          </ModalWrapper>
        )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-3">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-800">📂 Paiements</h1>
            <button
              onClick={() => setFormVisible(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              + Effectuer un paiement
            </button>
          </div>

          <div className="mb-4">
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
         <div className="w-full sm:max-w-xs">
            <select
              value={classeSelectionnee ?? ""}
              onChange={(e) => {
                const id = e.target.value;
                  if (id) {
                  setClasseSelectionnee(id);
                  setStatsVisible(true);
                }
              }}
              className=" px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>


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
                <th className="px-6 py-3">Statut</th>
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
                    <td className="px-6 py-3">
                        {p.statut === "Annulé" ? (
                            <span className="text-red-600 font-semibold">Annulé</span>
                        ) : (
                            <span className="text-green-600 font-medium">Valide</span>
                        )}
                    </td>
                    <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => setPaiementAModifier(p)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleAnnuler(p._id)}
                        className="text-red-600 hover:text-red-800 ml-3"
                        title="Annuler"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (p.eleve?._id) {
                          setEleveIdReleve(p.eleve._id);
                          setReleveVisible(true);
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 ml-3"
                      title="Voir le relevé"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    </td>
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
      {statsVisible && classeSelectionnee && (
        <ModalWrapper onClose={() => setStatsVisible(false)}>
          <StatsClasse classeId={classeSelectionnee} />
        </ModalWrapper>
      )}

    </div>
  );
};

export default PaiementsTable;
