import EleveTable from "../components/eleves/EleveTable";
import Sidebar from "../components/Sidebar";
const ElevePage = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="p-4 space-y-5 w-full">
                <h1 className="text-2xl mb-1 font-bold text-gray-800">🧑‍🎓 Gestion des Elèves</h1>
                <EleveTable/>
            </div>
        </div>
    );
};

export default ElevePage;