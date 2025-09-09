import { useEffect, useState } from "react";
import { getClasses, deleteClasse } from "../../services/classeService";
import AjoutClasse from "./AjoutClasse";
import UpdateClasse from "./UpdateClasse";
import ElevesClasse from "./ElevesClasse";
import toast from "react-hot-toast";
import { Edit, Trash2, Users, Plus, Search, X } from "lucide-react";
import ModalWrapper from "../modals/ModalWrapper";

type Classe = {
  _id: string;
  nom: string;
  niveau: string;
  anneeScolaire: number;
  enseignant?: { nom: string, prenom: string };
};

const ClassList = () => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [query, setQuery] = useState("");
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [viewElevesClasseId, setViewElevesClasseId] = useState<string | null>(null);
  const [fitreNiveau, setFiltreNiveau] = useState("");
  const [filtreEnseignant, setFiltreEnseignant] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 8;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClasses();
        setClasses(res.data);
      } catch {
        toast.error("Erreur chargement des classes");
      }
    };
    fetchClasses();
  }, []);

  const filtered = classes.filter((c) => {
    const q = query.toLowerCase();
    const matchQuery = 
      c.nom.toLowerCase().includes(q) ||
      c.niveau.toLowerCase().includes(q) ||
      String(c.anneeScolaire).includes(q);

    const matchNiveau = fitreNiveau ? c.niveau === fitreNiveau : true;
    const matchEnseignant = filtreEnseignant ?
    `${c.enseignant?.nom} ${c.enseignant?.prenom}` === filtreEnseignant : true ;

    return matchQuery && matchNiveau && matchEnseignant
  });

  const totalPages = Math.ceil(filtered.length / classesPerPage);
  const paginatedClasses = filtered.slice(
    (currentPage - 1) * classesPerPage,
    currentPage * classesPerPage
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette classe ?")) return;
    try {
      await deleteClasse(id);
      toast.success("Classe supprimée !");
      setClasses((prev) => prev.filter((c) => c._id !== id));
    } catch {
      toast.error("Erreur suppression");
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">🏛️ Gestion des Classes</h2>
            <p className="text-sm text-gray-500">Gérez les classes, niveaux et enseignants.</p>
          </div>

          <button
            onClick={() => setOpenForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Ajouter une classe
          </button>
        </div>

        {/* Recherche */}
        <div className="px-6 pb-4">
          <div className="relative w-full sm:max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Rechercher une classe…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 pl-9 pr-9 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="flex flex-col sm:flex-row gap-4 px-6 pb-4">
          <select 
            value={fitreNiveau}
            onChange={(e) => {
              setFiltreNiveau(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Tous les niveaux</option>
            {[...new Set(classes.map(c => c.niveau))].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <select 
            value={filtreEnseignant}
            onChange={(e) => {
              setFiltreEnseignant(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
             <option value="">Tous les enseignants</option>
              {[...new Set(classes.map(c => c.enseignant?.nom + " " + c.enseignant?.prenom))]
                .filter(Boolean)
                .map((ens, i) => (
                  <option key={i} value={ens}>{ens}</option>
              ))}
          </select>
        </div>

        {/* Tableau */}
        <div className="relative overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-left text-gray-600">
                <th className="px-6 py-3 font-medium">N°</th>
                <th className="px-6 py-3 font-medium">Nom</th>
                <th className="px-6 py-3 font-medium">Niveau</th>
                <th className="px-6 py-3 font-medium">Année</th>
                <th className="px-6 py-3 font-medium">Enseignant</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedClasses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14">
                    <div className="flex flex-col items-center justify-center text-center text-gray-500">
                      <p className="font-medium">Aucune classe trouvée</p>
                      <p className="text-sm">Ajuste ta recherche ou réinitialise le filtre.</p>
                      {query && (
                        <button
                          onClick={() => setQuery("")}
                          className="mt-3 text-sm text-blue-600 hover:underline"
                        >
                          Réinitialiser la recherche
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedClasses.map((classe, index) => {
                  const teacher = classe.enseignant
                    ? `${classe.enseignant.prenom} ${classe.enseignant.nom}`
                    : "Non attribué";
                  return (
                    <tr key={classe._id} className="odd:bg-white even:bg-gray-50">
                      <td className="px-6 py-3 text-gray-700">
                        {(currentPage - 1) * classesPerPage + index + 1}
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-900">{classe.nom}</td>
                      <td className="px-6 py-3 text-gray-700">{classe.niveau}</td>
                      <td className="px-6 py-3 text-gray-700">{classe.anneeScolaire}</td>
                      <td className="px-6 py-3 text-gray-700">{teacher}</td>
                      <td className="px-6 py-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedClasse(classe)}
                            title="Modifier"
                            aria-label="Modifier"
                            className="inline-flex items-center rounded-md px-2.5 py-1.5 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 text-gray-700" />
                          </button>
                          <button
                            onClick={() => handleDelete(classe._id)}
                            title="Supprimer"
                            aria-label="Supprimer"
                            className="inline-flex items-center rounded-md px-2.5 py-1.5 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                          <button
                            onClick={() => setViewElevesClasseId(classe._id)}
                            title="Voir les élèves"
                            aria-label="Voir les élèves"
                            className="inline-flex items-center rounded-md px-2.5 py-1.5 hover:bg-gray-100"
                          >
                            <Users className="h-4 w-4 text-green-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
                      ? "bg-blue-600 text-white"
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

      {/* Modales */}
      {openForm && (
        <ModalWrapper onClose={() => setOpenForm(false)}>
          <AjoutClasse onClose={() => setOpenForm(false)} />
        </ModalWrapper>
      )}

      {selectedClasse && (
        <ModalWrapper onClose={() => setSelectedClasse(null)}>
          <UpdateClasse classe={selectedClasse} onClose={() => setSelectedClasse(null)} />
        </ModalWrapper>
      )}

      {viewElevesClasseId && (
        <ModalWrapper onClose={() => setViewElevesClasseId(null)}>
          <ElevesClasse classeId={viewElevesClasseId} onClose={() => setViewElevesClasseId(null)} />
        </ModalWrapper>
      )}
    </div>
  );
};

export default ClassList;
