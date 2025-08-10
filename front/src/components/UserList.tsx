import { useEffect, useState } from "react";
import { getUsers, toogleUserActivation, deleteUser } from "../services/usersService";
import AjoutUtilisateur from "./AjoutUtilisateur";
import UpdateUser from "./UpdateUser";
import toast from "react-hot-toast";
import { Edit, Trash2, ToggleLeft, ToggleRight, Plus, Search, X } from "lucide-react";
import ModalWrapper from "./modals/ModalWrapper";

type User = {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  actif: boolean;
};

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 9;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch {
        toast.error("Erreur chargement utilisateurs");
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      `${u.prenom} ${u.nom}`.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / usersPerPage);
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleActivation = async (id: string, currentState: boolean) => {
    try {
      await toogleUserActivation(id);
      toast.success(`Utilisateur ${currentState ? "désactivé" : "activé"}`);
      const refreshed = await getUsers();
      setUsers(refreshed);
    } catch {
      toast.error("Erreur lors du changement d'état");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(id);
      toast.success("Utilisateur supprimé !");
      const refreshed = await getUsers();
      setUsers(refreshed);
    } catch {
      toast.error("Échec lors de la suppression");
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">👥 Gestion des Utilisateurs</h2>
            <p className="text-sm text-gray-500">Gérez les comptes, rôles et statuts.</p>
          </div>

          <button
            onClick={() => setOpenForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Ajouter
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Rechercher un utilisateur…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 pl-9 pr-9 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {!!query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="Effacer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-left text-gray-600">
                <th className="px-6 py-3 font-medium">N°</th>
                <th className="px-6 py-3 font-medium">Nom</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Téléphone</th>
                <th className="px-6 py-3 font-medium">Rôle</th>
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-gray-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr key={user._id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-6 py-3">{(currentPage - 1) * usersPerPage + index + 1}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {user.prenom} {user.nom}
                    </td>
                    <td className="px-6 py-3 text-gray-700">{user.email}</td>
                    <td className="px-6 py-3 text-gray-700">{user.telephone || "N/A"}</td>
                    <td className="px-6 py-3 capitalize text-gray-700">{user.role}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.actif ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.actif ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {user.actif ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(user)}
                          title="Modifier"
                          className="p-1.5 hover:bg-gray-100 rounded-md"
                        >
                          <Edit className="h-4 w-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          title="Supprimer"
                          className="p-1.5 hover:bg-red-100 rounded-md"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                        <button
                          onClick={() => handleActivation(user._id, user.actif)}
                          title={user.actif ? "Désactiver" : "Activer"}
                          className="p-1.5 hover:bg-gray-100 rounded-md"
                        >
                          {user.actif ? (
                            <ToggleLeft className="h-4 w-4 text-amber-600" />
                          ) : (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
            {/* Pagination */}
            {filtered.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Page <span className="font-medium">{currentPage}</span> / {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50"
              >
                ◀ Précédent
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`rounded-lg border border-gray-300 px-3 py-1.5 text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50"
              >
                Suivant ▶
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      {openForm && (
        <ModalWrapper onClose={() => setOpenForm(false)}>
          <AjoutUtilisateur setOpen={setOpenForm} />
        </ModalWrapper>
      )}

      {selectedUser && (
        <ModalWrapper onClose={() => setSelectedUser(null)}>
          <UpdateUser user={selectedUser} onClose={() => setSelectedUser(null)} />
        </ModalWrapper>
      )}
    </div>
  );
};

export default UserList;

       