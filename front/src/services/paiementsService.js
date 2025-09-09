import api from './api';
import axios from "axios";

export const creerPaiement = async (data) => {
  try {
    // Calcul dynamique de l'année scolaire si absente
    if (!data.anneeScolaire) {
      const now = new Date(data.datePaiement || Date.now());
      const y = now.getFullYear();
      const m = now.getMonth() + 1;
      data.anneeScolaire = m >= 9 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
    }

    // Normalisation du mois
    if (data.mois) {
      data.mois = data.mois.charAt(0).toUpperCase() + data.mois.slice(1).toLowerCase();
    }

    const res = await api.post("/paiements?format=pdf", data, {
      responseType: "blob",
    });

    return res.data;
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erreur Axios:", error.message);
    } else {
      console.error("Erreur inconnue:", error);
    }
    throw error;
  }
};


export const listerPaiements = async (params = {}) => {
  try {
    const res = await api.get('/paiements', { params });
    return res.data.paiements;
  } catch (error) {
    console.error('Erreur récupération paiements:', error.message);
    return [];
  }
};

export const modifierPaiement = async (id, data) => {
  const res = await api.put(`/paiements/${id}`, data);
  return res.data;
};

export const annulerPaiement = async (id) => {
  const res = await api.patch(`/paiements/${id}/annuler`);
  return res.data;
};

export const getReleveEleve = async (eleveId, anneeScolaire) => {
  try {
    const res = await api.get(`/paiements/releve/${eleveId}`, {
      params: { anneeScolaire },
    });
    return res.data;
  } catch (error) {
    console.error('Erreur relevé élève:', error.message);
    return null;
  }
};

export const getTotalParClasse = async (classeId, params = {}) => {
  try {
    const res = await api.get(`/paiements/total-par-classe/${classeId}`, { params });
    return res.data;
  } catch (error) {
    console.error('Erreur total par classe:', error.message);
    return null;
  }
};

export const getImpayes = async () => {
  const res = await api.get('/paiements/impayes');
  return res.data;
};


export const getRepartitionModesPaiement = async () => {
  const res = await api.get('/paiements/repartition-modes');
  return res.data.data || [];
};

export const rechercherEleve = async (query) => {
  try {
    const res = await api.get(`/paiements/recherche-eleve`, {
      params: { q: query },
    });
    return res.data.resultats;
  } catch (error) {
    console.error('Erreur recherche élève:', error.message);
    return [];
  }
};

