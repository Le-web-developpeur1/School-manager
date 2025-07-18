import api from "./api";

//Connexion utilisateur
export const login = (Credentials) => {
    return api.post('/auth/login', Credentials);
};

//Déconnexion et suppression du token
export const logout = () => {
    localStorage.removeItem('token');
};

//Vérification si l'utilisateur est connecté
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};