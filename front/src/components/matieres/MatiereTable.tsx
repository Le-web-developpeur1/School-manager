import { useEffect, useState } from "react";
import { getMatieres, deleteMatiere } from "../../services/matiereService";
import ModifierMatiere from "./ModifierMatiere";
import toast from 'react-hot-toast';
import AjoutMatiere from './AjoutMatiere';


const MatiereTable = () => {
  const [matieres, setMatieres] = useState([]);
  const [matiereEnEdition, setMatiereEnEdition] = useState(null);

  const fetchMatieres = async () => {
    try {
      const res = await getMatieres();
      const data = Array.isArray(res.data.matieres) ? res.data.matieres : [];
      setMatieres(data);
      toast.success("Matières chargées avec succès !");
    } catch (error) {
      console.error("Erreur chargement matières :", error);
      toast.error("Erreur lors du chargement des matières.");
      setMatieres([]);
    }
  };

  useEffect(() => {
    fetchMatieres();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cette matière ?")) {
      try {
        await deleteMatiere(id);
        toast.success("🗑️ Matière supprimée !");
        fetchMatieres();
      } catch (error) {
        toast.error("❌ Échec de la suppression.");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <AjoutMatiere onRefresh={fetchMatieres} />

      <table className="w-full border mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Nom</th>
            <th className="p-2">Classe</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {matieres.map((matiere: any) => (
            <tr key={matiere._id} className="border-t">
              <td className="p-2">{matiere.nom}</td>
              <td className="p-2">{matiere.classe?.nom || "—"}</td>
              <td className="p-2 space-x-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => setMatiereEnEdition(matiere)}
                >
                  Modifier
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  onClick={() => handleDelete(matiere._id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {matiereEnEdition && (
        <ModifierMatiere
          matiere={matiereEnEdition}
          onClose={() => setMatiereEnEdition(null)}
          onRefresh={fetchMatieres}
        />
      )}
    </div>
  );
};

export default MatiereTable;
