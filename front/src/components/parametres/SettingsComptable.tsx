import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getSettingsComptable,
  updateSettingsComptable,
} from "../../services/settingsService";
import ProfilUtilisateur from "./ProfilUtilisateur";

const SettingsComptable = () => {
  const [parametres, setParametres] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParametres = async () => {
      try {
        const data = await getSettingsComptable();
        setParametres(data);
      } catch {
        toast.error("Erreur chargement des paramètres");
      } finally {
        setLoading(false);
      }
    };
    fetchParametres();
  }, []);

  const handleChange = (field, value) => {
    setParametres((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setParametres((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSave = async () => {
    try {
      await updateSettingsComptable(parametres);
      toast.success("Paramètres mis à jour");
    } catch {
      toast.error("Erreur mise à jour");
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (!parametres) return <div className="p-6 text-red-600">Paramètres introuvables</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">⚙️ Paramètres du Comptable</h2>

      <div className="grid grid-cols-2 gap-6 items-start">
        {/* 👤 Profil utilisateur */}
        <div className="flex flex-col justify-between h-full">
          <ProfilUtilisateur />
        </div>

        {/* Colonne droite */}
        <div className="flex flex-col gap-6 h-full">
          {/* 📅 Bloc 2 : Périodes */}
          <div className="bg-white border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-700">📅 Périodes par défaut</h3>
            <input
              value={parametres.anneeScolaireActive}
              onChange={(e) => handleChange("anneeScolaireActive", e.target.value)}
              placeholder="Année scolaire active"
              className="w-full px-3 py-1.5 border rounded text-sm"
            />
            <input
              value={parametres.moisFiscalDepart}
              onChange={(e) => handleChange("moisFiscalDepart", e.target.value)}
              placeholder="Mois fiscal de départ"
              className="w-full px-3 py-1.5 border rounded text-sm"
            />
            <input
              value={parametres.periodeCloture}
              onChange={(e) => handleChange("periodeCloture", e.target.value)}
              placeholder="Période de clôture"
              className="w-full px-3 py-1.5 border rounded text-sm"
            />
          </div>

          {/* 📄 + 🔔 Bloc 3 et 4 côte à côte */}
          <div className="grid grid-cols-2 gap-6">
            {/* 📄 Bloc 3 : Préférences d’export */}
            <div className="bg-white border rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-700">📄 Préférences d’export</h3>
              <select
                value={parametres.formatExport}
                onChange={(e) => handleChange("formatExport", e.target.value)}
                className="w-full px-3 py-1.5 border rounded text-sm"
              >
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
              </select>

              <select
                value={parametres.orientation}
                onChange={(e) => handleChange("orientation", e.target.value)}
                className="w-full px-3 py-1.5 border rounded text-sm"
              >
                <option value="Portrait">Portrait</option>
                <option value="Paysage">Paysage</option>
              </select>

              <input
                value={parametres.nomFichier}
                onChange={(e) => handleChange("nomFichier", e.target.value)}
                placeholder="Nom du fichier export"
                className="w-full px-3 py-1.5 border rounded text-sm"
              />
            </div>

            {/* 🔔 Bloc 4 : Notifications */}
            <div className="bg-white border rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-700">🔔 Notifications</h3>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={parametres.notifications.alertesPaiement}
                  onChange={(e) =>
                    handleNestedChange("notifications", "alertesPaiement", e.target.checked)
                  }
                />
                <span>Activer les alertes de paiement</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={parametres.notifications.mailExport}
                  onChange={(e) =>
                    handleNestedChange("notifications", "mailExport", e.target.checked)
                  }
                />
                <span>Recevoir un mail après chaque export</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={parametres.notifications.rappelCloture}
                  onChange={(e) =>
                    handleNestedChange("notifications", "rappelCloture", e.target.checked)
                  }
                />
                <span>Rappels de clôture mensuelle</span>
              </label>
            </div>

            {/* 💾 Bouton global en bas des deux blocs */}
            <div className="col-span-2 text-right pt-2">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm"
              >
                💾 Enregistrer les paramètres
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsComptable;
