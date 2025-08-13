import api from "./api";

export const createEleve = (data) => {
    return api.post('/eleves', data);
};

export const getEleves = async (params) => {
    const res = await api.get('/eleves', { params });
    return res.data;
};

export const getEleveById = (id) => {
    return api.get(`/eleves/${id}`);
};

export const updateEleve = (id, data) => {
    return api.put(`/eleves/${id}`, data);
};

export const deleteEleve = (id) => {
    return api.delete(`/eleves/${id}`);
};

export const archiverEleve = (id) => {
    return api.patch(`/eleves/${id}/archive`);
};

export const getElevesParClasse = () => {
    return api.get('/eleves-par-classe');
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