import api from './api';

export const creerPaiement = async (data) => {
  try {
    const res = await api.post('/paiements', data);
    return res.data.paiement;
  } catch (error) {
    console.error('Erreur création paiement:', error.message);
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
