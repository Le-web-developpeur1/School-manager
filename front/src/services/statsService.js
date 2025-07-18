import api from "./api";

export const getEncaissementsParMois = () => {
    return api.get('/stats/encaissements-mensuels');
};

export const getStatsClasse = (classeId) => {
    return api.get(`/stats/classe/${classeId}`);
};