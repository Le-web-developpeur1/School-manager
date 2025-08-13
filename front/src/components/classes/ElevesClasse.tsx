import { useEffect, useState } from "react";
import { getClasseDetails } from "../../services/classeService";
import toast from "react-hot-toast";

type Props = {
  classeId: string;
  onClose: () => void;
};

type Eleve = {
  _id: string;
  nom: string;
  prenom: string;
  age?: number;
};

type Enseignant = {
  nom: string;
  prenom: string;
  email: string;
};

const ElevesClasse = ({ classeId, onClose }: Props) => {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [enseignant, setEnseignant] = useState<Enseignant | null>(null);
  const [classeNom, setClasseNom] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getClasseDetails(classeId);
        const { classe, eleves } = res.data;
        setClasseNom(classe.nom);
        setEnseignant(classe.enseignant || null);
        setEleves(eleves || []);
      } catch (err) {
        toast.error("Erreur chargement des détails");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [classeId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-2">📘 Classe : {classeNom}</h2>
        {enseignant && (
          <p className="mb-4 text-sm text-gray-700">
            <strong>👨🏽‍🏫 Enseignant :</strong> {enseignant.nom} {enseignant.prenom} ({enseignant.email})
          </p>
        )}

        {loading ? (
          <p>Chargement...</p>
        ) : eleves.length === 0 ? (
          <p>Aucun élève dans cette classe.</p>
        ) : (
          <ul className="space-y-2">
            {eleves.map((eleve) => (
              <li key={eleve._id} className="border p-2 rounded">
                {eleve.prenom} {eleve.nom}
                {eleve.age !== undefined && ` — ${eleve.age} ans`}
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
