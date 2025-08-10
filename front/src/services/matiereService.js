import api from './api';

export const getMatieres = () => {
    return api.get('/matieres');
};

export const createMatiere = (data) => {
    return api.post('/matieres', data);
};

export const updateMatiere = (id, data) => {
    return api.put(`/matieres/${id}`, data);
};

export const deleteMatiere = (id) => {
    return api.delete(`/matieres/${id}`);
};