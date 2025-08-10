import React, { useEffect, useState } from "react";
import { getEleveById, updateEleve } from "../../services/elevesService";

const UpdateEleve = ({ id, onSuccess }: { id: string; onSuccess?: () => void }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    sexe: "Masculin",
    dateNaissance: "",
    parentContact: "",
    niveau: "",
    classe: "",
    anneeScolaire: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEleve = async () => {
      try {
        const res = await getEleveById(id);
        const eleve = res?.data || res;
        setFormData({
          nom: eleve.nom || "",
          prenom: eleve.prenom || "",
          sexe: eleve.sexe || "Masculin",
          dateNaissance: eleve.dateNaissance?.slice(0, 10) || "",
          parentContact: eleve.parentContact || "",
          niveau: eleve.niveau || "",
          classe: eleve.classe?._id || "",
          anneeScolaire: eleve.anneeScolaire || "",
        });
      } catch (err) {
        setError("Impossible de charger les données de l'élève");
      }
    };

    fetchEleve();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateEleve(id, formData);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
      <h2 className="text-xl font-bold">Modifier l'élève</h2>

      <div className="grid grid-cols-2 gap-4">
        <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" className="input" required />
        <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" className="input" required />
        <select name="sexe" value={formData.sexe} onChange={handleChange} className="input">
          <option value="Masculin">Masculin</option>
          <option value="Feminin">Feminin</option>
        </select>
        <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} className="input" />
        <input name="parentContact" value={formData.parentContact} onChange={handleChange} placeholder="Contact parent" className="input" />
        <input name="niveau" value={formData.niveau} onChange={handleChange} placeholder="Niveau" className="input" />
        <input name="classe" value={formData.classe} onChange={handleChange} placeholder="ID classe" className="input" required />
        <input name="anneeScolaire" value={formData.anneeScolaire} onChange={handleChange} placeholder="Année scolaire" className="input" required />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
        {loading ? "Modification..." : "Modifier"}
      </button>
    </form>
  );
};

export default UpdateEleve;
