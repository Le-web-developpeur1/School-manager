import Sidebar from "../components/Sidebar";
import AdminExports from "../components/exports/AdminExports";

const AdminExportPage = () => {

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="p-4 space-y-5 w-full">
          <AdminExports />
      </div>
    </div>
  );
};

export default AdminExportPage;
