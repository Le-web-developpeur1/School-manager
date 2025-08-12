import api from "./api";

export const getStatsClasse = (classeId) => {
    return api.get(`/stats/classe/${classeId}`);
};

export const getStatsGlobal = () => {
    return api.get('/stats/dashboard-admin');
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
  

// statsService.ts
export const getStatsComptable = async () => {
    try {
      const res = await api.get('/stats/comptable');
      return res.data;
    } catch (error) {
      console.error('Erreur stats comptable:', error.message);
      return { data: {} };
    }
};
  