import { useEffect, useState } from "react";
import { getElevesParClasse } from "../../services/statsService";
import toast from "react-hot-toast";

type Props = {
  classeId: string;
  onClose: () => void;
};

type Eleve = {
  _id: string;
  nom: string;
  prenom: string;
  age: number;
};

const ElevesClasse = ({ classeId, onClose }: Props) => {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEleves = async () => {
      try {
        const res = await getElevesParClasse(classeId);
        setEleves(res.data);
      } catch (err) {
        toast.error("Erreur chargement des élèves");
      } finally {
        setLoading(false);
      }
    };
    fetchEleves();
  }, [classeId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">👨🏽‍🎓 Élèves de la classe</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : eleves.length === 0 ? (
          <p>Aucun élève dans cette classe.</p>
        ) : (
          <ul className="space-y-2">
            {eleves.map((eleve) => (
              <li key={eleve._id} className="border p-2 rounded">
                {eleve.prenom} {eleve.nom} — {eleve.age} ans
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElevesClasse;
