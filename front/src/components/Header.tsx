import { Bell, Settings, UserRound } from "lucide-react";

const Header = ({ title }: { title: string }) => {
  const role = localStorage.getItem("role");

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Titre */}
      <div className="flex items-center gap-2">
        <UserRound className="h-5 w-5 text-gray-500" />
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
          {title || "Tableau de Bord"} - {role === "admin" ? "Admin" : "Comptable"}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2">
          <Bell className="h-5 w-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
