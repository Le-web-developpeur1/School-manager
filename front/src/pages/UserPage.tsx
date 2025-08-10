import Sidebar from "../components/Sidebar";
import UserList from "../components/UserList";

const UserPage = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="p-4 space-y-5 w-full">
                <UserList roles={["admin", "comptable"]} />
            </div>
        </div>
    );
};

export default UserPage;