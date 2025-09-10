import api from "./api";

export const createClasse = (data) => {
    return api.post('/classes', data);
};

export const getClasses = () => {
    return api.get('/classes');
};

export const getClasseById = (id) => {
    return api.get(`/classes/${id}`);
};

export const updateClasse = (id, data) => {
    return api.put(`/classes/${id}`, data);
};

export const deleteClasse = (id) => {
    return api.delete(`/classes/${id}`);
};

export const getNiveau = () => {
    return api.get('/classes/niveaux');
};

export const getClasse =  async () => {
    const res = await api.get('/classes/classe');
    return res.data;
};

export const getClasseDetails = (id) => {
    return api.get(`/classes/${id}/details`);
};
    
  