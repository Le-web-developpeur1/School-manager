import api from './api';

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

// 📄 Export PDF individuel par élève et par mois
export const exportPaiementIndividuelPDF = async (
  eleveId,
  mois,
  annee,
  anneeScolaire
) => {
  try {
    const query = new URLSearchParams();
    if (mois) query.append("mois", mois);
    if (annee) query.append("annee", annee);
    if (anneeScolaire) query.append("anneeScolaire", anneeScolaire);

    const res = await api.get(`/exports/individuel/${eleveId}?${query.toString()}`, {
      responseType: "blob",
    });
    return res.data;
  } catch (error) {
    console.error("Erreur export individuel PDF:", error.message);
    throw error;
  }
};

// 📄 Export PDF historique complet d’un élève
export const exportHistoriquePaiementsPDF = async (eleveId) => {
  try {
    const res = await api.get(`/exports/historique/${eleveId}`, {
      responseType: "blob",
    });
    return res.data;
  } catch (error) {
    console.error("Erreur export historique PDF:", error.message);
    throw error;
  }
};