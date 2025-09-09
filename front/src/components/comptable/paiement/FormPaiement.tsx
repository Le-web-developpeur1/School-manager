import { useEffect, useState } from "react";
import { creerPaiement, rechercherEleve } from "../../../services/paiementsService";
import { getEnumsPaiement } from "../../../services/enumsService";
import toast from "react-hot-toast";

const FormPaiement = () => {
  const [form, setForm] = useState({
    eleve: "",
    montant: "",
    motif: "",
    mois: "",
    periode: "",
    datePaiement: new Date().toISOString().split("T")[0],
    modePaiement: "",
    payeur: "",
    justificatifUrl: "",
    verifie: true
  });

  const [enums, setEnums] = useState({
    mois: [],
    motif: [],
    periode: [],
    modePaiement: []
  });

  const [query, setQuery] = useState("");
  const [resultats, setResultats] = useState([]);
  const [nomAffiche, setNomAffiche] = useState("");

  useEffect(() => {
    const chargerEnums = async () => {
      const data = await getEnumsPaiement();
      setEnums(data);
    };
    chargerEnums();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        const data = await rechercherEleve(query);
        setResultats(data);
      } else {
        setResultats([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pdfData = await creerPaiement(form);
      toast.success("Paiement enregistré, génération du reçu en cours...");
      setForm({
        eleve: "",
        montant: "",
        motif: "",
        mois: "",
        periode: "",
        datePaiement: new Date().toISOString().split("T")[0],
        modePaiement: "",
        payeur: "",
        justificatifUrl: "",
        verifie: true
      });
      
      setTimeout(() => {
        const blob = new Blob([pdfData], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      }, 2000);
    
      setNomAffiche("");
    } catch (error) {
      alert("Erreur lors de l'enregistrement du paiement.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">💳 Ajouter un paiement</h2>
        <div className="relative">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher élève par nom, prénom ou matricule"
                className="w-full border rounded px-3 py-2"
            />
            {resultats.length > 0 && (
                <ul className="absolute z-10 bg-white border rounded w-full max-h-[200px] overflow-y-auto mt-1">
                {resultats.map((e) => (
                    <li
                    key={e._id}
                    onClick={() => {
                        setForm({ ...form, eleve: e._id });
                        setNomAffiche(`${e.nom} ${e.prenom}`);
                        setQuery("");
                        setResultats([]);
                    }}
                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer text-sm"
                    >
                    {e.nom} {e.prenom} {e.matricule && `(${e.matricule})`}
                    </li>
                ))}
                </ul>
                )}
        </div>

        {form.eleve && (
            <input
                type="text"
                value={nomAffiche}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 text-sm"
            />
        )}

      <input
        type="number"
        name="montant"
        value={form.montant}
        onChange={handleChange}
        placeholder="Montant en GNF"
        required
        className="w-full border rounded px-3 py-2"
      />

      <select name="motif" value={form.motif} onChange={handleChange} className="w-full border rounded px-3 py-2">
        <option value="">Motif</option>
        {enums.motif.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select name="mois" value={form.mois} onChange={handleChange} required className="w-full border rounded px-3 py-2">
        <option value="">Mois</option>
        {enums.mois.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select name="periode" value={form.periode} onChange={handleChange} className="w-full border rounded px-3 py-2">
        <option value="">Période</option>
        {enums.periode.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select name="modePaiement" value={form.modePaiement} onChange={handleChange} className="w-full border rounded px-3 py-2">
        <option value="">Mode de paiement</option>
        {enums.modePaiement.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <input
        type="date"
        name="datePaiement"
        value={form.datePaiement}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="text"
        name="payeur"
        value={form.payeur}
        onChange={handleChange}
        placeholder="Nom du payeur (optionnel)"
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="text"
        name="justificatifUrl"
        value={form.justificatifUrl}
        onChange={handleChange}
        placeholder="Lien justificatif (optionnel)"
        className="w-full border rounded px-3 py-2"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="verifie"
          checked={form.verifie}
          onChange={handleChange}
        />
        Paiement vérifié
      </label>

      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
        Enregistrer
      </button>
    </form>
  );
};

export default FormPaiement;
