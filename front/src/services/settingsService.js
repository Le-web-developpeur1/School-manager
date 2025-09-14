import api from './api';

/*--Services Admins--*/

export const getSettings = async () => {
  const res = await api.get('/settings/admin');
  return res.data.data; 
};

export const updateSettings = async (payload) => {
  const res = await api.put('/settings/admin', payload);
  return res.data.data;
};

/*--Services Comptable--*/

export const getSettingsComptable = async () => {
  try {
    const res = await api.get('/settings/comptable');
    return res.data;
  } catch (error) {
    console.error("Erreur chargement paramètres:", error.message);
    throw error;
  }
};

export const updateSettingsComptable = async (playload) => {
  try {
    const res = await api.put('/settings/comptable', playload);
    return res.data;
  } catch (error) {
    console.error("Erreur mise à jour paramètres:", error.message);
    throw error;
  }
};

export const getProfil = async () => {
  const res = await api.get('/settings/user/profil');
  return res.data;
};

export const updateProfil = async (playload) => {
  const res = await api.put('/settings/user/update-profil', playload);
  return res.data;
};

export const updatePassword = async (ancienMotDePasse, nouveauMotDePasse) => {
  const res = await api.put('/settings/user/update-password', {
    ancienMotDePasse, nouveauMotDePasse
  });
  return res.data;
};
