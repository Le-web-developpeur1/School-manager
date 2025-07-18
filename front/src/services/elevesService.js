import api from "./api";

export const createEleve = (data) => {
    return api.post('/eleves', data);
};

export const getEleves = (params) => {
    return api.get('/eleves', { params });
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