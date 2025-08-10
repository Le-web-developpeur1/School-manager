import { useEffect, useState } from "react";
import { updateClasse } from "../../services/classeService";
import { getEnseignants } from "../../services/enseignantService";
import toast from "react-hot-toast";

type Props = {
  classe: {
    _id: string;
    nom: string;
    niveau: string;
    annee: number;
    enseignant?: { _id: string };
  };
  onClose: () => void;
};

type Enseignant = {
  _id: string;
  nom: string;
  prenom: string;
};

const UpdateClasse = ({ classe, onClose }: Props) => {
  const [nom, setNom] = useState(classe.nom);
  const [niveau, setNiveau] = useState(classe.niveau);
  const [annee, setAnnee] = useState<number>(classe.annee);
  const [enseignantId, setEnseignantId] = useState(classe.enseignant?._id || "");
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);

  useEffect(() => {
    const fetchEnseignants = async () => {
      try {
        const res = await getEnseignants();
        setEnseignants(res.data);
      } catch (err) {
        toast.error("Erreur chargement enseignants");
      }
    };
    fetchEnseignants();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateClasse(classe._id, { nom, niveau, annee, enseignantId });
      toast.success("Classe mise à jour !");
      onClose();
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">✏️ Modifier la classe</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Nom de la classe"
          />
          <input
            type="text"
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Niveau"
          />
          <input
            type="number"
            value={annee}
            onChange={(e) => setAnnee(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            placeholder="Année"
          />
          <select
            value={enseignantId}
            onChange={(e) => setEnseignantId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Sélectionner un enseignant --</option>
            {enseignants.map((ens) => (
              <option key={ens._id} value={ens._id}>
                {ens.prenom} {ens.nom}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateClasse;
