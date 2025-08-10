import { useState, useEffect } from "react";
import { updateMatiere } from "../../services/matiereService";
import { getClasses } from "../../services/classeService";

interface Props {
  matiere: any;
  onClose: () => void;
  onRefresh: () => void;
}

const ModifierMatiere = ({ matiere, onClose, onRefresh }: Props) => {
  const [nom, setNom] = useState(matiere.nom);
  const [classeId, setClasseId] = useState(matiere.classe?._id || "");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClasses();
        setClasses(res.data);
      } catch (error) {
        console.error("Erreur chargement classes :", error);
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMatiere(matiere._id, { nom, classe: classeId });
      alert("Matière modifiée !");
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Erreur modification :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded shadow">
      <h2 className="text-lg font-bold">Modifier la matière</h2>

      <div>
        <label className="block">Nom</label>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block">Classe</label>
        <select
          value={classeId}
          onChange={(e) => setClasseId(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">-- Sélectionner une classe --</option>
          {classes.map((classe: any) => (
            <option key={classe._id} value={classe._id}>
              {classe.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
          Annuler
        </button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default ModifierMatiere;
