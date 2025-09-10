import React, { useEffect, useMemo, useState } from "react";
import {
  getEleves,
  deleteEleve,
  archiverEleve,
} from "../../services/elevesService";
import ModalWrapper from "../modals/ModalWrapper";
import AjoutEleve from "./AjoutEleve";
import UpdateEleve from "./UpdateEleve";
import { Edit, Trash2, Archive } from "lucide-react"; 
import toast from "react-hot-toast";

type Classe = { nom?: string };
type Eleve = {
  _id: string;
  matricule: string;
  nom: string;
  prenom?: string;
  archive?: boolean;
  classe?: Classe;
};

const useDebouncedValue = <T,>(value: T, delay = 300) => {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const EleveTable: React.FC = () => {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEleveId, setSelectedEleveId] = useState<string | null>(null);

  const [filtreClasse, setFiltreClasse] = useState("");

  const elevesFiltres = eleves.filter(e => {
    if (!filtreClasse) return true;
    return e.classe?.nom === filtreClasse;
  });
  

  const fetchEleves = async () => {
    setLoading(true);
    try {
      const res = await getEleves({ search: debouncedSearch, page, limit });
      setEleves(res.eleves || []);
      setTotalPages(res?.pagination?.pages || 1);
    } catch (err) {
      console.error("Erreur lors du chargement des élèves", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset page when search or limit change
    setPage(1);
  }, [debouncedSearch, limit]);

  useEffect(() => {
    fetchEleves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page, limit]);

  const handleDelete = async (id: string) => {
    const ok = confirm("Confirmer la suppression de cet élève ?");
    if (!ok) return;
    await deleteEleve(id);
    toast.success('Éleve supprimé avec succès !');
    fetchEleves();
  };

  const handleArchive = async (id: string) => {
    const eleve = eleves.find((e) => e._id === id);
    if (!eleve) return;
    const action = eleve.archive ? "restaurer" : "archiver";
    const ok = confirm(`Confirmer vous que vous voulez ${action} cet élève ?`);
    if (!ok) return;

    try {
      await archiverEleve(id);
      fetchEleves();
      toast.success(`Élève ${action} avec succès !`);
    } catch (error) {
      toast.error(`Erreur lors de la tentative pour ${action} l'élève`);
      console.error("Erreur d'archivage", error);
    }
  };

  const handleSuccess = () => {
    setShowAddForm(false);
    setSelectedEleveId(null);
    fetchEleves();
  };

  const startIndex = useMemo(() => (page - 1) * limit, [page, limit]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">🧑‍🎓 Gestion des Elèves</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700 active:bg-blue-800 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter élève
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-6 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Rechercher un élève…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-9 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                aria-label="Effacer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Lignes:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filtreClasse}
            onChange={(e) => {
              setFiltreClasse(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
          >
            <option value="">Toutes les classes</option>
            {[...new Set(eleves.map(e => e.classe?.nom).filter(Boolean))].map((nom, i) => (
              <option key={i} value={nom}>{nom}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-left text-gray-600">
              <th className="px-6 py-3 font-medium">N°</th>
              <th className="px-6 py-3 font-medium">Matricule</th>
              <th className="px-6 py-3 font-medium">Nom</th>
              <th className="px-6 py-3 font-medium">Statut</th>
              <th className="px-6 py-3 font-medium">Classe</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-3 w-8 bg-gray-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-3 w-40 bg-gray-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-16 bg-gray-200 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="ml-auto h-3 w-24 bg-gray-200 rounded" />
                  </td>
                </tr>
              ))}

            {!loading && eleves.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-14">
                  <div className="flex flex-col items-center justify-center text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mb-2 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 118 0v2m-6 4h4M12 3v4m6 4h.01M6 11h.01" />
                    </svg>
                    <p className="font-medium">Aucun élève trouvé</p>
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="mt-3 text-sm text-blue-600 hover:underline"
                      >
                        Réinitialiser la recherche
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              elevesFiltres.map((eleve, index) => (
                <tr key={eleve._id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {eleve.matricule || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {eleve.nom} {eleve.prenom || ""}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        eleve.archive
                          ? "bg-gray-100 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          eleve.archive ? "bg-gray-500" : "bg-green-500"
                        }`}
                      />
                      {eleve.archive ? "Archivé" : "Actif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {eleve.classe?.nom || "—"}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        className="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setSelectedEleveId(eleve._id)}
                      >
                       <Edit size={20} />
                      </button>

                      <button
                        className="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm text-amber-700 hover:bg-amber-50"
                        onClick={() => handleArchive(eleve._id)}
                     >
                        <Archive size={20} />
                      </button>

                      <button
                        className="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(eleve._id)}
                      >
                       <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Page <span className="font-medium">{page}</span> / {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50"
          >
            ◀ Précédent
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50"
          >
            Suivant ▶
          </button>
        </div>
      </div>

      {/* Formulaires dynamiques */}
      {showAddForm && (
          <ModalWrapper onClose={() => setShowAddForm(false)}>
            <AjoutEleve onSuccess={handleSuccess} />
          </ModalWrapper>
      )}

      {selectedEleveId && (
        <ModalWrapper onClose={() => setSelectedEleveId(null)}>
          <UpdateEleve id={selectedEleveId} onSuccess={handleSuccess} />
        </ModalWrapper>
      )}


    </div>
  );
};

export default EleveTable;
