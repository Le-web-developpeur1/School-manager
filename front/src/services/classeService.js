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
    return api.delete(`/eleves/${id}`);
};