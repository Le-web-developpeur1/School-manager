import Sidebar from "../components/Sidebar";
import PaiementsTable from "../components/comptable/paiement/PaiementsTable";

const PaiementsPage = () => {

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="p-4 space-y-5 w-full">
          <PaiementsTable />
      </div>
    </div>
  );
};

export default PaiementsPage;
