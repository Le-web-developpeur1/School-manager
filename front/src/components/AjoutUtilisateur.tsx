import { useState } from "react";
import { createUser } from "../services/usersService";
import toast from "react-hot-toast";

const AjoutUtilisateurModal = ({ setOpen }) => {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [role, setRole] = useState("admin");
  const [password, setPassword] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await createUser({ prenom, nom, email, telephone, role, password });
      setOpen(false);
      window.location.reload();
      toast.success("Utilisateur ajouté avec succès !");
    } catch (err) {
      console.error("Ajout utilisateur échoué ❌", err);
      toast.error("Erreur lors de l'ajout de l'utilisateur !")
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-30 backdrop-blur-sm z-50">
      <form className="bg-white p-6 rounded shadow-lg w-full max-w-md" onSubmit={handleSave}>
        <h2 className="text-lg font-bold mb-4">Ajout d'un utilisateur</h2>

        <label className="block mb-3">
          Prénom :
          <input
            type="text"
            className="border border-gray-300 p-2 w-full rounded"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          Nom :
          <input
            type="text"
            className="border border-gray-300 p-2 w-full rounded"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          Email :
          <input
            type="email"
            className="border border-gray-300 p-2 w-full rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          Téléphone :
          <input
            type="text"
            className="border border-gray-300 p-2 w-full rounded"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          Mot de passe :
          <input
            type="password"
            className="border border-gray-300 p-2 w-full rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label className="block mb-4">
          Rôle :
          <select
            className="border border-gray-300 p-2 w-full rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="comptable">Comptable</option>
            <option value="enseignant">Enseignant</option>
          </select>
        </label>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700">
            Enregistrer
          </button>
          <button type="button" onClick={() => setOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjoutUtilisateurModal;
