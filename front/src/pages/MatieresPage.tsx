import MatiereTable from "../components/matieres/MatiereTable";
import Sidebar from "../components/Sidebar";
const MatieresPage = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="p-4 space-y-5">
                <h1 className="text-2xl mb-1 font-bold text-gray-800">🧑‍🏫 Gestion des Matières</h1>
                <MatiereTable/>
            </div>
        </div>
    );
};

export default MatieresPage;