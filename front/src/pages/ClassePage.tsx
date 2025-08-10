import Sidebar from "../components/Sidebar";
import ClassList from "../components/classes/ClassList";
const ClassePage = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="p-4 space-y-5">
                <h1 className="text-2xl mb-1 font-bold text-gray-800">🏛️ Gestion des Classes</h1>
                <ClassList/>
            </div>
        </div>
    );
};

export default ClassePage;