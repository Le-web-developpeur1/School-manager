import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSettings, updateSettings } from "../../services/settingsService";

const SettingsAdmin = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch {
        toast.error("Impossible de charger les paramètres");
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  const handleChange = (field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      toast.success("Paramètres mis à jour");
    } catch {
      toast.error("Échec de la mise à jour");
    }
  };

  if (loading) return <div className="px-6 py-4">Chargement...</div>;
  if (!settings) return <div className="px-6 py-4 text-red-600">⚠️ Aucun paramètre trouvé.</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">⚙️ Paramètres généraux</h2>
            <p className="text-sm text-gray-500">Configurez les préférences globales du système.</p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm"
          >
            💾 Enregistrer
          </button>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-4 gap-4 text-sm h-full">
          {/* Établissement */}
          <div className="bg-gray-50 p-2 rounded-xl border space-y-1 overflow-auto">
            <h3 className="font-semibold text-gray-700">🏫 Établissement</h3>
            <input value={settings.schoolName} onChange={(e) => handleChange("schoolName", e.target.value)} placeholder="Nom de l’école" className="w-full px-2 py-1 border rounded" />
            <input value={settings.academicYear} onChange={(e) => handleChange("academicYear", e.target.value)} placeholder="Année scolaire" className="w-full px-2 py-1 border rounded" />
            <input value={settings.logoUrl} onChange={(e) => handleChange("logoUrl", e.target.value)} placeholder="URL du logo" className="w-full px-2 py-1 border rounded" />
            {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="h-10 mt-2 rounded" />}
          </div>

          {/* Préférences */}
          <div className="bg-gray-50 p-4 rounded-xl border space-y-2 overflow-auto">
            <h3 className="font-semibold text-gray-700">🌍 Préférences</h3>
            <select value={settings.language} onChange={(e) => handleChange("language", e.target.value)} className="w-full px-2 py-1 border rounded">
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
            <input value={settings.timezone} onChange={(e) => handleChange("timezone", e.target.value)} placeholder="Fuseau horaire" className="w-full px-2 py-1 border rounded" />
          </div>

          {/* Notifications */}
          <div className="bg-gray-50 p-2 rounded-xl border space-y-2 overflow-auto">
            <h3 className="font-semibold text-gray-700">🔔 Notifications</h3>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.notifications?.emailEnabled} onChange={(e) => setSettings((prev: any) => ({ ...prev, notifications: { ...prev.notifications, emailEnabled: e.target.checked } }))} />
              Activer les emails
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={settings.notifications?.smsEnabled} onChange={(e) => setSettings((prev: any) => ({ ...prev, notifications: { ...prev.notifications, smsEnabled: e.target.checked } }))} />
              Activer les SMS
            </label>
          </div>

          {/* Périodes scolaires */}
          <div className="bg-gray-50 p-4 rounded-xl border space-y-2 overflow-auto">
            <h3 className="font-semibold text-gray-700">📅 Périodes scolaires</h3>
            {settings.periods?.map((p: any, i: number) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <input value={p.nom || ""} onChange={(e) => {
                  const updated = [...settings.periods];
                  updated[i] = { ...updated[i], nom: e.target.value };
                  setSettings({ ...settings, periods: updated });
                }} placeholder="Nom" className="px-2 py-1 border rounded" />
                <input type="date" value={p.debut ? String(p.debut).slice(0, 10) : ""} onChange={(e) => {
                  const updated = [...settings.periods];
                  updated[i] = { ...updated[i], debut: e.target.value };
                  setSettings({ ...settings, periods: updated });
                }} className="px-2 py-1 border rounded" />
                <input type="date" value={p.fin ? String(p.fin).slice(0, 10) : ""} onChange={(e) => {
                  const updated = [...settings.periods];
                  updated[i] = { ...updated[i], fin: e.target.value };
                  setSettings({ ...settings, periods: updated });
                }} className="px-2 py-1 border rounded" />
              </div>
            ))}
          </div>
          {/* Permissions */}
          <div className="bg-gray-50 p-4 rounded-xl border space-y-2 overflow-auto">
            <h3 className="font-semibold text-gray-700">🔐 Permissions</h3>
            {["admin", "enseignant", "comptable"].map((role) => (
              <div key={role}>
                <div className="text-xs font-medium text-gray-600 mb-1">{role}</div>
                {["exports", "paiements", "parametres", "eleves", "notes"].map((module) => {
                  const list = settings.permissions?.[role] || [];
                  const checked = list.includes(module);
                  return (
                    <label key={module} className="inline-flex items-center gap-2 mr-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const prevList = settings.permissions?.[role] || [];
                          const updated = e.target.checked
                            ? Array.from(new Set([...prevList, module]))
                            : prevList.filter((m: string) => m !== module);
                          setSettings((prev: any) => ({
                            ...prev,
                            permissions: {
                              ...prev.permissions,
                              [role]: updated,
                            },
                          }));
                        }}
                      />
                      {module}
                    </label>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Export */}
          <div className="bg-gray-50 p-4 rounded-xl border space-y-2 overflow-auto">
            <h3 className="font-semibold text-gray-700">📁 Export</h3>
            <input
              value={settings.exportDefaults?.filePrefix || ""}
              onChange={(e) =>
                setSettings((prev: any) => ({
                  ...prev,
                  exportDefaults: { ...prev.exportDefaults, filePrefix: e.target.value },
                }))
              }
              placeholder="Préfixe des fichiers"
              className="w-full px-2 py-1 border rounded"
            />
            <select
              value={settings.exportDefaults?.formatMontant || "fr"}
              onChange={(e) =>
                setSettings((prev: any) => ({
                  ...prev,
                  exportDefaults: { ...prev.exportDefaults, formatMontant: e.target.value },
                }))
              }
              className="w-full px-2 py-1 border rounded"
            >
              <option value="fr">Format français</option>
              <option value="us">Format US</option>
            </select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.exportDefaults?.includeSignature}
                onChange={(e) =>
                  setSettings((prev: any) => ({
                    ...prev,
                    exportDefaults: {
                      ...prev.exportDefaults,
                      includeSignature: e.target.checked,
                    },
                  }))
                }
              />
              Inclure la signature dans les PDF
            </label>
          </div>

          {/* Notation */}
          <div className="bg-gray-50 p-4 rounded-xl border space-y-2 overflow-auto">
            <h3 className="font-semibold text-gray-700">🧮 Notation</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.grandingPolicy?.useCoefficients}
                onChange={(e) =>
                  setSettings((prev: any) => ({
                    ...prev,
                    grandingPolicy: {
                      ...prev.grandingPolicy,
                      useCoefficients: e.target.checked,
                    },
                  }))
                }
              />
              Utiliser les coefficients
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.grandingPolicy?.rounding}
                onChange={(e) =>
                  setSettings((prev: any) => ({
                    ...prev,
                    grandingPolicy: {
                      ...prev.grandingPolicy,
                      rounding: e.target.checked,
                    },
                  }))
                }
              />
              Arrondir les moyennes
            </label>
          </div>

          {/* Activation */}
          <div className="bg-gray-50 p-4 rounded-xl border space-y-2 overflow-auto">
            <h3 className="font-semibold text-gray-700">✅ Activation</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!settings.isActive}
                onChange={(e) =>
                  setSettings((prev: any) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
              />
              Système actif
            </label>
          </div>

          {/* Résumé */}
        </div>
          <div className=" bg-white p-4 max-w-md rounded-xl border mt-4 text-sm text-gray-600">
            <h3 className="font-semibold text-gray-700 mb-2">📘 Résumé</h3>
            <p>École : <strong>{settings.schoolName}</strong></p>
            <p>Année scolaire : <strong>{settings.academicYear}</strong></p>
            <p>Langue : <strong>{settings.language}</strong></p>
            <p>
              Notifications : Email {settings.notifications?.emailEnabled ? "✅" : "❌"} / SMS{" "}
              {settings.notifications?.smsEnabled ? "✅" : "❌"}
            </p>
            <div className="flex justify-end">
              <a
                href="/profil-utilisateur"
                className="inline-flex items-center  rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm"
              >
                👤 Voir le profil utilisateur
              </a>
            </div>
          </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
