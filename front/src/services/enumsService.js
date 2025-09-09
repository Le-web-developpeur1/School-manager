import api from './api';

export const getEnumsPaiement = async () => {
    try {
      const res = await api.get("/paiements/enums");
      return res.data.data || {
        mois: [],
        motif: [],
        periode: [],
        modePaiement: [],
        statut: []
      };
    } catch (error) {
      console.error("Erreur récupération enums paiement :", error.response?.data || error.message);
      return {
        mois: [],
        motif: [],
        periode: [],
        modePaiement: [],
        statut: []
      };
    }
  };