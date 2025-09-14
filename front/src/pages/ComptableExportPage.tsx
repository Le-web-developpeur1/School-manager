
import Sidebar from "../components/Sidebar";
import ComptableExport from "../components/exports/ComptableExport";

const ComptableExportPage = () => {

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="p-4 space-y-5 w-full">
          <ComptableExport />
      </div>
    </div>
  );
};

export default ComptableExportPage;
