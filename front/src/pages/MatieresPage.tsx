import MatiereTable from "../components/matieres/MatiereTable";
import Sidebar from "../components/Sidebar";
const MatieresPage = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="p-4 space-y-5 w-full">
                <MatiereTable/>
            </div>
        </div>
    );
};

export default MatieresPage;