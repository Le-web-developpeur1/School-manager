import api from "./api";

export const getStatsClasse = (classeId) => {
    return api.get(`/stats/classe/${classeId}`);
};

export const getStatsGlobal = async () => {
    try {
      const res = await api.get('/stats/paiements');
      return res.data; // ✅ renvoie directement l'objet JSON
    } catch (error) {
      console.error('Erreur récupération stats globales:', error.response?.data || error.message);
      return null;
    }
  };
  

export const getEncaissementsParMois = () => {
    return api.get('/stats/encaissements-mensuels');
};

export const getRatioElevesEnseignants = () => {
    return api.get('/stats/ratio-eleves-enseignants');
};

export const getRepartitionParNiveau = () => {
    return api.get('/stats/repartition-niveaux');
};

export const getRepartitionSexe = () => {
    return api.get('/stats/repartition-sexe');
};

export const getElevesParClasse = () => {
    return api.get("/stats/eleves-par-classe");
};  
  
export const getStatsComptable = async () => {
    try {
      const res = await api.get('/stats/comptable');
      return res.data;
    } catch (error) {
      console.error('Erreur stats comptable:', error.message);
      return { data: {} };
    }
};

export const getReparitifionMotifs = async () => {
    try {
      const res = await api.get("/stats/motif");
      return res.data.data || []; // ✅ renvoie directement le tableau
    } catch (error) {
      console.error("Erreur récupération motifs:", error.response?.data || error.message);
      return [];
    }
  };
  

  