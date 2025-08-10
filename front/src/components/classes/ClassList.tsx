import { useEffect, useState } from "react";
import { getClasses, deleteClasse } from "../../services/classeService";
import AjoutClasse from "./AjoutClasse";
import UpdateClasse from "./UpdateClasse";
import ElevesClasse from "./ElevesClasse";
import toast from "react-hot-toast";

type Classe = {
  _id: string;
  nom: string;
  niveau: string;
  annee: number;
  enseignant?: { nom: string; prenom: string };
};

const ClassList = () => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [query, setQuery] = useState("");
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [viewElevesClasseId, setViewElevesClasseId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 10;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClasses();
        setClasses(res.data);
      } catch (err) {
        toast.error("Erreur chargement des classes");
      }
    };
    fetchClasses();
  }, []);

  const filtered = classes.filter((c) =>
    c.nom.toLowerCase().includes(query.toLowerCase()) ||
    c.niveau.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / classesPerPage);
  const paginatedClasses = filtered.slice(
    (currentPage - 1) * classesPerPage,
    currentPage * classesPerPage
  );

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Supprimer cette classe ?");
    if (!confirm) return;

    try {
      await deleteClasse(id);
      toast.success("Classe supprimée !");
      setClasses(classes.filter((c) => c._id !== id));
    } catch (err) {
      toast.error("Erreur suppression");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="🔍 Rechercher une classe..."
          className="border px-4 py-2 rounded w-full max-w-md"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          onClick={() => setOpenForm(true)}
          className="ml-4 text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-100"
        >
          ➕ Ajouter une classe
        </button>
      </div>

      <table className="w-full table-auto border-collapse bg-white shadow rounded">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">N°</th>
            <th className="px-4 py-2">Nom</th>
            <th className="px-4 py-2">Niveau</th>
            <th className="px-4 py-2">Année</th>
            <th className="px-4 py-2">Enseignant</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedClasses.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                Aucune classe trouvée pour cette recherche.
              </td>
            </tr>
          ) : (
            paginatedClasses.map((classe, index) => (
              <tr key={classe._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{(currentPage - 1) * classesPerPage + index + 1}</td>
                <td className="px-4 py-2 font-semibold">{classe.nom}</td>
                <td className="px-4 py-2">{classe.niveau}</td>
                <td className="px-4 py-2">{classe.annee}</td>
                <td className="px-4 py-2">
                  {classe.enseignant?.prenom} {classe.enseignant?.nom || "Non attribué"}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => setSelectedClasse(classe)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(classe._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => setViewElevesClasseId(classe._id)}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Voir les élèves
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {filtered.length > 0 && totalPages > 1 && (
        <div className="flex justify-end items-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ◀ Précédent
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Suivant ▶
          </button>
        </div>
      )}

      {openForm && <AjoutClasse onClose={() => setOpenForm(false)} />}
      {selectedClasse && (
        <UpdateClasse
          classe={selectedClasse}
          onClose={() => setSelectedClasse(null)}
        />
      )}
      {viewElevesClasseId && (
        <ElevesClasse
          classeId={viewElevesClasseId}
          onClose={() => setViewElevesClasseId(null)}
        />
      )}
    </div>
  );
};

export default ClassList;
