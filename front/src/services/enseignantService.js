import api from './api';

export const getEnseignants = (params) => {
    return api.get('/enseignants', { params });
  };
  