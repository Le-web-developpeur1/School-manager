import Sidebar from "../components/Sidebar";
import SettingsAdmin from "../components/parametres/SettingsAdminl";

const SettingsPage = () => {

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="p-4 space-y-5 w-full">
          <SettingsAdmin />
      </div>
    </div>
  );
};

export default SettingsPage;
