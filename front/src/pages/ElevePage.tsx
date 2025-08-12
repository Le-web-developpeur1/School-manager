import EleveTable from "../components/eleves/EleveTable";
import Sidebar from "../components/Sidebar";
const ElevePage = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="p-4 space-y-5 w-full">
                <EleveTable/>
            </div>
        </div>
    );
};

export default ElevePage;