import api from './api';

export const getEnseignants = () => {
    return api.get('/users/enseignants');
  };
  