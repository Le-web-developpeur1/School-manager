import { useEffect, useState } from "react";
import { createClasse } from "../../services/classeService";
import { getEnseignants } from "../../services/enseignantService";
import toast from "react-hot-toast";

type Props = {
  onClose: () => void;
};

type Enseignant = {
  _id: string;
  nom: string;
  prenom: string;
};

const AjoutClasse = ({ onClose }: Props) => {
  const [nom, setNom] = useState("");
  const [niveau, setNiveau] = useState("");
  const [annee, setAnnee] = useState<number | "">("");
  const [enseignantId, setEnseignantId] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !niveau || !annee) {
      toast.error("Tous les champs sauf enseignant sont obligatoires");
      return;
    }

    try {
      await createClasse({ nom, niveau, annee: Number(annee), enseignantId });
      toast.success("Classe ajoutée !");
      onClose();
    } catch (err) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">➕ Ajouter une classe</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nom de la classe"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Niveau (ex: Terminale)"
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Année scolaire"
            value={annee}
            onChange={(e) => setAnnee(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjoutClasse;
