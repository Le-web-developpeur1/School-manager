import React, { useEffect, useState } from "react";
import { createEleve } from "../../services/elevesService";
import { getNiveau, getClasse } from "../../services/classeService";
import toast from "react-hot-toast";

const AjoutEleve = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [niveaux, setNiveaux] = useState<string[]>([]);
  const [classes, setClasses] = useState<{ _id: string; nom: string }[]>([]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createEleve(formData);
      if (onSuccess) onSuccess();
      toast.success("Élève enregistré avec succès !")
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [niveauxRes, classesRes] = await Promise.all([
          getNiveau(),
          getClasse()
        ]);
        setNiveaux(niveauxRes.data);
        setClasses(classesRes);
      } catch (error) {
        console.error("Erreur lors du chargement des niveaux ou classes", error);
      }
    };

    fetchData();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Ajouter un élève</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 text-sm text-gray-600">Nom</label>
          <input name="nom" value={formData.nom} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-600">Prénom</label>
          <input name="prenom" value={formData.prenom} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-600">Sexe</label>
          <select name="sexe" value={formData.sexe} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="Masculin">Masculin</option>
            <option value="Feminin">Feminin</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-600">Date de naissance</label>
          <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-600">Contact du parent</label>
          <input name="parentContact" value={formData.parentContact} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <select name="niveau" value={formData.niveau} onChange={handleChange} required className="w-full border rounded px-3 py-2">
          <option value="">Sélectionner un niveau</option>
          {niveaux.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        
        <select name="classe" value={formData.classe} onChange={handleChange} required className="w-full border rounded px-3 py-2">
          <option value="">Sélectionner une classe</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>{c.nom}</option>
          ))}
        </select>

        <div>
          <label className="block mb-1 text-sm text-gray-600">Année scolaire</label>
          <input name="anneeScolaire" value={formData.anneeScolaire} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Ajout en cours..." : "Ajouter"}
      </button>
    </form>
  );
};

export default AjoutEleve;
