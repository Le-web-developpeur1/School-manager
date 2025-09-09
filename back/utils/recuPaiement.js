const genererRecuPaiement = (paiement) => {
    const numero = `REC-${new Date().getFullYear()}-${String(paiement._id).slice(-5)}`;
    return {
      numero,
      date: paiement.datePaiement,
      montant: paiement.montant,
      eleve: `${paiement.eleve?.nom || ""} ${paiement.eleve?.prenom || ""}`,
      mois: paiement.mois,
      motif: paiement.motif,
      modePaiement: paiement.modePaiement,
      payeur: paiement.payeur || "—",
      classe: paiement.eleve?.classe?.nom || "—"
    };
};
  
module.exports = { genererRecuPaiement };
  