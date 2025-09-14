import Sidebar from "../components/Sidebar";
import ProfilUtilisateur from "../components/parametres/ProfilUtilisateur";

const AdminProfil = () => {

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="p-4 mx-auto w-[600px] space-y-5">
          <ProfilUtilisateur />
      </div>
    </div>
  );
};

export default AdminProfil;
