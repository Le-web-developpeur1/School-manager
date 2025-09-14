import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getProfil,
  updateProfil,
  updatePassword,
} from "../../services/settingsService";

const ProfilUtilisateur = () => {
  const [profil, setProfil] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "" });
  const [passwords, setPasswords] = useState({ ancien: "", nouveau: "" });

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const data = await getProfil();
        setProfil(data);
        setForm({ nom: data.nom, prenom: data.prenom, email: data.email });
      } catch {
        toast.error("Erreur chargement du profil");
      }
    };
    fetchProfil();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const updated = await updateProfil(form);
      setProfil(updated);
      setEditing(false);
      toast.success("Profil mis à jour");
    } catch {
      toast.error("Erreur mise à jour du profil");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await updatePassword(passwords.ancien, passwords.nouveau);
      setPasswords({ ancien: "", nouveau: "" });
      toast.success("Mot de passe mis à jour");
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur mise à jour mot de passe");
    }
  };

  if (!profil) return <div className="p-6">Chargement du profil...</div>;

  return (
    <div className="bg-white border rounded-xl p-4 space-y-6">
      <h3 className="text-lg font-semibold text-gray-700">👤 Informations personnelles</h3>

      <div className="grid grid-cols-2 gap-4">
        <input
          value={form.nom}
          onChange={(e) => handleChange("nom", e.target.value)}
          disabled={!editing}
          className="px-3 py-2 border rounded"
          placeholder="Nom"
        />
        <input
          value={form.prenom}
          onChange={(e) => handleChange("prenom", e.target.value)}
          disabled={!editing}
          className="px-3 py-2 border rounded"
          placeholder="Prénom"
        />
        <input
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={!editing}
          className="px-3 py-2 border rounded col-span-2"
          placeholder="Email"
        />
        <input
          value={profil.role}
          disabled
          className="px-3 py-2 border rounded bg-gray-100 col-span-2"
          placeholder="Rôle"
        />
        <input
            value={
                profil.lastLogin
                ? `${new Date(profil.lastLogin).toLocaleString("fr-FR")}  -  Dernière connexion`
                : "—"
            }          
            disabled
            className="px-3 py-2 border rounded bg-gray-100 col-span-2"
            placeholder="Dernière connexion"
        />
      </div>

      <div className="flex space-x-4">
        {editing ? (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            💾 Enregistrer
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            ✏️ Modifier
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">🔐 Ancien mot de passe</h4>
          <input
            type="password"
            value={passwords.ancien}
            onChange={(e) => setPasswords((p) => ({ ...p, ancien: e.target.value }))}
            className="px-3 py-2 border rounded w-full"
            placeholder="Ancien mot de passe"
          />
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">🔐 Nouveau mot de passe</h4>
          <input
            type="password"
            value={passwords.nouveau}
            onChange={(e) => setPasswords((p) => ({ ...p, nouveau: e.target.value }))}
            className="px-3 py-2 border rounded w-full"
            placeholder="Nouveau mot de passe"
          />
        </div>
        <div className="col-span-2">
          <button
            onClick={handlePasswordChange}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            🔒 Mettre à jour le mot de passe
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilUtilisateur;
