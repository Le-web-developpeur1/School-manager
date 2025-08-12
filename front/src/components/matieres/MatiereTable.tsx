import { useEffect, useState } from "react";
import { getMatieres, deleteMatiere } from "../../services/matiereService";
import AjoutMatiere from "./AjoutMatiere";
import ModifierMatiere from "./ModifierMatiere";
import ModalWrapper from "../modals/ModalWrapper";
import toast from "react-hot-toast";
import { Edit, Trash2, Plus, Search, X } from "lucide-react";

type Matiere = {
  _id: string;
  nom: string;
  classe?: { nom: string };
};

const MatiereTable = () => {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [query, setQuery] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [matiereEnEdition, setMatiereEnEdition] = useState<Matiere | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const matieresPerPage = 10;

  const fetchMatieres = async () => {
    try {
      const res = await getMatieres();
      const data = Array.isArray(res.data.matieres) ? res.data.matieres : [];
      setMatieres(data);
    } catch {
      toast.error("Erreur lors du chargement des matières.");
      setMatieres([]);
    }
  };

  useEffect(() => {
    fetchMatieres();
  }, []);

  const filtered = matieres.filter(
    (m) =>
      m.nom.toLowerCase().includes(query.toLowerCase()) ||
      m.classe?.nom?.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / matieresPerPage);
  const paginatedMatieres = filtered.slice(
    (currentPage - 1) * matieresPerPage,
    currentPage * matieresPerPage
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette matière ?")) return;
    try {
      await deleteMatiere(id);
      toast.success("Matière supprimée !");
      fetchMatieres();
    } catch {
      toast.error("Échec de la suppression.");
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">🧑‍🏫 Gestion des Matières</h2>
            <p className="text-sm text-gray-500">Gérez les matières et leur association aux classes.</p>
          </div>

          <button
            onClick={() => setOpenForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Ajouter une matière
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pb-4">
          <div className="relative w-full sm:max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Rechercher une matière ou classe…"
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

        {/* Table */}
        <div className="relative overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-left text-gray-600">
                <th className="px-6 py-3">N°</th>
                <th className="px-6 py-3">Nom</th>
                <th className="px-6 py-3">Classe</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedMatieres.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-14 text-center text-gray-500">
                    Aucune matière trouvée.
                  </td>
                </tr>
              ) : (
                paginatedMatieres.map((matiere, index) => (
                  <tr key={matiere._id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-6 py-3">{(currentPage - 1) * matieresPerPage + index + 1}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{matiere.nom}</td>
                    <td className="px-6 py-3 text-gray-700">{matiere.classe?.nom || "—"}</td>
                    <td className="px-6 py-2">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setMatiereEnEdition(matiere)}
                          className="p-1.5 hover:bg-gray-100 rounded-md"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleDelete(matiere._id)}
                          className="p-1.5 hover:bg-red-100 rounded-md"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
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
          <AjoutMatiere
            onRefresh={fetchMatieres}
            onClose={() => setOpenForm(false)}
          />
        </ModalWrapper>
      )}

      {matiereEnEdition && (
        <ModalWrapper onClose={() => setMatiereEnEdition(null)}>
          <ModifierMatiere
            matiere={matiereEnEdition}
            onRefresh={fetchMatieres}
            onClose={() => setMatiereEnEdition(null)}
          />
        </ModalWrapper>
      )}
    </div>
  );
};

export default MatiereTable;
