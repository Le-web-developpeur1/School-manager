import { useState } from "react";
import { modifierPaiement } from "../../../services/paiementsService";
import toast from "react-hot-toast";

type Props = {
  paiement: {
    _id: string;
    montant: number;
    motif: string;
    mois: string;
    periode?: string;
    datePaiement: string;
    modePaiement: string;
    payeur?: string;
    justificatifUrl?: string;
    verifie: boolean;
  };
  onClose: () => void;
  onRefresh: () => void;
};

const ModifierPaiementForm = ({ paiement, onClose, onRefresh }: Props) => {
  const [form, setForm] = useState({
    montant: paiement.montant,
    motif: paiement.motif,
    mois: paiement.mois,
    periode: paiement.periode || "",
    datePaiement: paiement.datePaiement.split("T")[0],
    modePaiement: paiement.modePaiement,
    payeur: paiement.payeur || "",
    justificatifUrl: paiement.justificatifUrl || "",
    verifie: paiement.verifie
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await modifierPaiement(paiement._id, form);
      toast.success("Paiement modifié avec succès");
      onRefresh();
      onClose();
    } catch {
      toast.error("Erreur lors de la modification");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">✏️ Modifier le paiement</h2>

      <input type="number" name="montant" value={form.montant} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="Montant" />

      <select name="motif" value={form.motif} onChange={handleChange} required className="w-full border rounded px-3 py-2">
        <option value="">Motif</option>
        <option value="Scolarité">Scolarité</option>
        <option value="Inscription">Inscription</option>
        <option value="Transport">Transport</option>
        <option value="Cantine">Cantine</option>
      </select>

      <select name="mois" value={form.mois} onChange={handleChange} required className="w-full border rounded px-3 py-2">
        {[
          "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
          "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ].map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select name="periode" value={form.periode} onChange={handleChange} className="w-full border rounded px-3 py-2">
        <option value="">Période</option>
        <option value="Mensuel">Mensuel</option>
        <option value="Trimestre 1">Trimestre 1</option>
        <option value="Trimestre 2">Trimestre 2</option>
        <option value="Trimestre 3">Trimestre 3</option>
        <option value="Annuel">Annuel</option>
      </select>

      <input type="date" name="datePaiement" value={form.datePaiement} onChange={handleChange} required className="w-full border rounded px-3 py-2" />

      <select name="modePaiement" value={form.modePaiement} onChange={handleChange} required className="w-full border rounded px-3 py-2">
        <option value="Espèces">Espèces</option>
        <option value="Mobile Money">Mobile Money</option>
        <option value="Virement">Virement</option>
        <option value="Chèque">Chèque</option>
      </select>

      <input type="text" name="payeur" value={form.payeur} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Payeur (optionnel)" />

      <input type="text" name="justificatifUrl" value={form.justificatifUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Lien justificatif (optionnel)" />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="verifie" checked={form.verifie} onChange={handleChange} />
        Paiement vérifié
      </label>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm">Annuler</button>
        <button type="submit" className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Enregistrer</button>
      </div>
    </form>
  );
};

export default ModifierPaiementForm;
