import Sidebar from "../components/Sidebar";
import SettingsComptable from "../components/parametres/SettingsComptable";

const SettingsComptablePage = () => {

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="p-4 space-y-5 w-full">
          <SettingsComptable />
      </div>
    </div>
  );
};

export default SettingsComptablePage;
