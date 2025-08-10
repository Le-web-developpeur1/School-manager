import { useState, useEffect } from "react";
import { createMatiere } from "../../services/matiereService";
import { getClasses } from "../../services/classeService";

const AjoutMatiere = () => {
  const [nom, setNom] = useState("");
  const [classeId, setClasseId] = useState("");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClasses();
        setClasses(res.data); // adapte selon ta structure
      } catch (error) {
        console.error("Erreur lors du chargement des classes :", error);
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMatiere({ nom, classe: classeId });
      setNom("");
      setClasseId("");
      alert("Matière ajoutée !");
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow max-w-md">
      <h2 className="text-lg font-bold">Ajouter une matière</h2>

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

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Ajouter
      </button>
    </form>
  );
};

export default AjoutMatiere;
