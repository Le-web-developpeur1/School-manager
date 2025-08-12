import api from '../api/api';

// Export PDF des paiements d'une classe
export const exportPaiementsPDF = async (classeId) => {
  try {
    const res = await api.get(`/exports/classe/${classeId}/pdf`, {
      responseType: 'blob',
    });
    return res.data;
  } catch (error) {
    console.error('Erreur export PDF:', error.message);
    throw error;
  }
};

//Export Excel des paiements d'une classe
export const exportPaiementsExcel = async (classeId) => {
  try {
    const res = await api.get(`/exports/classe/${classeId}`, {
      responseType: 'blob',
    });
    return res.data;
  } catch (error) {
    console.error('Erreur export Excel:', error.message);
    throw error;
  }
};

// 📋 Export Excel de la liste des élèves
export const exportListeElevesExcel = async () => {
  try {
    const res = await api.get('/exports/liste-eleves/excel', {
      responseType: 'blob',
    });
    return res.data;
  } catch (error) {
    console.error('Erreur export liste élèves:', error.message);
    throw error;
  }
};
