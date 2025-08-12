const Eleve = require('../../models/Eleve');
const Paiement = require('../../models/Paiement');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

exports.exportPaiementsClasse = async (req, res) => {
    try {
        const { classeId } = req.params;
        const { anneeScolaire, mois, annee } = req.query;

        //Récupérer les élèves de la classe
        const elevesDeLaClasse = await Eleve.find({ classe: classeId}, '_id nom prenom matricule');

        const idsEleves = elevesDeLaClasse.map(e => e._id);
        const filtre = { eleve: { $in: idsEleves } };

        if (anneeScolaire) {
            filtre.anneeScolaire = anneeScolaire;
        }

        if (mois && annee) {
            const debut = new Date(annee, mois - 1, 1);
            const fin = new Date(annee, mois, 1);
            filtre.dataPaiement = { $gte: debut, $lt: fin };
        }

        const paiements = await Paiement.find(filtre)
            .populate('eleve', 'nom prenom matricule')
            .populate('comptable', 'nom');

        //Création du fichier Excel
        const workbook = new ExcelJS.Workbook();
        const Worksheet = workbook.addWorksheet('Relevé Paiements');

        Worksheet.columns = [
            { header: 'Nom', key: 'nom', width: 20 },
            { header: 'Prénom', key: 'prenom', width: 20 },
            { header: 'Matricule', key: 'matricule', width: 20 },
            { header: 'Motif', key: 'motif', width: 25 },
            { header: 'Montant', key: 'montant', width: 15 },
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Comptable', key: 'comptable', width: 20 },
        ];

        paiements.forEach(p => {
            Worksheet.addRow({
                nom: p.eleve.nom,
                prenom: p.eleve.prenom,
                matricule: p.eleve.matricule,
                motif: p.motif,
                montant: p.montant,
                date: p.datePaiement.toLocaleDateString(),
                comptable: p.comptable ? p.comptable.nom : '-',
            });
        });

        //Envoi du fichier
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="ReleveClasse.xlsx"');

        await workbook.xlsx.write(res);
        res.end();   
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur export Excel", erreur: error.message });
    }
};

exports.exportPaiementsClassePDF = async (req, res) => {
    try {
      const { classeId } = req.params;
      const { anneeScolaire, mois, annee } = req.query;
  
      const eleves = await Eleve.find({ classe: classeId }, '_id nom prenom matricule');
      const idsEleves = eleves.map(e => e._id);
  
      const filtre = { eleve: { $in: idsEleves } };
      if (anneeScolaire) filtre.anneeScolaire = anneeScolaire;
      if (mois && annee) {
        const debut = new Date(annee, mois - 1, 1);
        const fin = new Date(annee, mois, 1);
        filtre.datePaiement = { $gte: debut, $lt: fin };
      }
  
      const paiements = await Paiement.find(filtre)
        .populate('eleve', 'nom prenom matricule')
        .populate('comptable', 'nom')
        .sort({ datePaiement: 1 });
  
      const doc = new PDFDocument();
      const nomClasse = classeId.toString().slice(-6); // à remplacer par le nom réel si dispo
      const filename = `Releve_Paiements_Classe_${nomClasse}.pdf`;
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      doc.pipe(res);
  
      doc.fontSize(18).text('Relevé de Paiements par Classe', { align: 'center' });
      doc.moveDown();
  
      if (anneeScolaire) doc.fontSize(12).text(`Année scolaire : ${anneeScolaire}`);
      if (mois && annee) doc.text(`Période : ${mois}/${annee}`);
      doc.moveDown();
  
      let total = 0;
      paiements.forEach(p => {
        doc.text(`${p.datePaiement.toLocaleDateString()} - ${p.eleve.nom} ${p.eleve.prenom} (${p.eleve.matricule}) - ${p.motif} - ${p.montant} GNF - Comptable : ${p.comptable?.nom || '-'}`);
        total += p.montant;
        doc.moveDown(0.5);
      });
  
      doc.moveDown();
      doc.fontSize(14).text(`Total encaissé : ${total} GNF`, { align: 'right' });
      doc.end();
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur export PDF", erreur: error.message });
    }
  };