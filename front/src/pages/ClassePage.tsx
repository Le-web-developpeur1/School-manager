import Sidebar from "../components/Sidebar";
import ClassList from "../components/classes/ClassList";
const ClassePage = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="p-4 space-y-5 w-full">
                <ClassList/>
            </div>
        </div>
    );
};

export default ClassePage;