import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type' : 'application/json',
    },
});

//Ajout automatique du token à chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🚀 Requête envoyée :', config.method, config.url);
    console.log('🔎 Headers envoyés :', config.headers);
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;