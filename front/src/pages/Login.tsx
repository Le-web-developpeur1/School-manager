import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login({ email, password });
      const { token, utilisateur, message } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", utilisateur.role);

      toast.success(message || "Connexion réussie !");
      
      setTimeout(() => {
        navigate(utilisateur.role === "admin" ? "/admin" : "/comptable");
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        toast.error("Email ou mot de passe incorrect");
        setLoading(false);
      }, 800);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/images/School_manager.png')" }}
    >
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm ml-72 mb-68 bg-gray-120 bg-opacity-90 backdrop-blur-md rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
          Connexion
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded-lg text-white text-sm font-medium transition duration-200 ${
            loading
              ? "bg-blue-500 opacity-50 cursor-not-allowed"
              : "bg-green-900 hover:bg-blue-900"
          } flex items-center justify-center`}
        >
          {loading ? (
            <span className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></span>
          ) : (
            "Se connecter"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
