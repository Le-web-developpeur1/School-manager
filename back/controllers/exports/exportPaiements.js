const Eleve = require('../../models/Eleve');
const Paiement = require('../../models/Paiement');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const Classe = require('../../models/Classe');
const mongoose = require('mongoose');

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
            .populate('comptable', 'nom prenom');

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
            { header: 'Comptable', key: 'comptable', width: 50 },
        ];

        paiements.forEach(p => {
            Worksheet.addRow({
                nom: p.eleve.nom,
                prenom: p.eleve.prenom,
                matricule: p.eleve.matricule,
                motif: p.motif,
                montant: p.montant,
                date: p.datePaiement.toLocaleDateString(),
                comptable: p.comptable ? p.comptable.prenom + p.comptable.nom : '-',
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
      .populate('comptable', 'nom prenom')
      .sort({ datePaiement: 1 });

    const classeDoc = await Classe.findById(classeId).select('nom niveau');
    const nomClasse = classeDoc?.nom || 'Classe inconnue';
    const niveau = classeDoc?.niveau || '—';

    const doc = new PDFDocument({ margin: 40 });
    const filename = `Releve_Paiements_${nomClasse.replace(/\s+/g, '_')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);

    // 🧾 En-tête
    doc.fontSize(18).text(`Relevé de Paiements — ${nomClasse}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Niveau : ${niveau}`, { align: 'center' });
    doc.moveDown();
    if (anneeScolaire) doc.text(`Année scolaire : ${anneeScolaire}`);
    if (mois && annee) doc.text(`Période : ${mois}/${annee}`);
    doc.moveDown();

    // 📊 Tableau manuel
    const startX = doc.x;
    let startY = doc.y;
    const rowHeight = 20;

    const columns = [
      { label: "Date", width: 70 },
      { label: "Élève", width: 180 },
      { label: "Motif", width: 80 },
      { label: "Montant", width: 80 },
      { label: "Comptable", width: 150 },
    ];

    // 🧱 Dessiner l'en-tête
    doc.font("Helvetica-Bold").fontSize(10);
    columns.forEach((col, i) => {
      doc.rect(startX + columns.slice(0, i).reduce((a, c) => a + c.width, 0), startY, col.width, rowHeight).stroke();
      doc.text(col.label, startX + columns.slice(0, i).reduce((a, c) => a + c.width, 0) + 5, startY + 5, {
        width: col.width - 10,
        align: 'left'
      });
    });

    startY += rowHeight;
    doc.font("Helvetica").fontSize(9);
    let total = 0;

    paiements.forEach(p => {
      const values = [
        p.datePaiement?.toLocaleDateString() || '—',
        p.eleve ? `${p.eleve.nom} ${p.eleve.prenom} (${p.eleve.matricule})` : '—',
        p.motif || '—',
        p.montant ? `${p.montant.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} GNF` : '—',
        p.comptable ? `${p.comptable.prenom || ''} ${p.comptable.nom || ''}`.trim() : '—'
      ];

      columns.forEach((col, i) => {
        doc.rect(startX + columns.slice(0, i).reduce((a, c) => a + c.width, 0), startY, col.width, rowHeight).stroke();
        doc.text(values[i], startX + columns.slice(0, i).reduce((a, c) => a + c.width, 0) + 5, startY + 5, {
          width: col.width - 10,
          align: 'left'
        });
      });

      startY += rowHeight;
      total += p.montant || 0;

      // 🧠 Saut de page si nécessaire
      if (startY + rowHeight > doc.page.height - 50) {
        doc.addPage();
        startY = doc.y;
      }
    });

    // ✅ Footer
    doc.moveDown(2);
    doc.fontSize(12).text(`Total encaissé : ${total.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} GNF`, { align: 'right' });
    doc.moveDown();

    doc.end();
  } catch (error) {
    console.error("Erreur export PDF :", error);
    res.status(500).json({ success: false, message: "Erreur export PDF", erreur: error.message });
  }
};


exports.exportPaiementIndividuel = async (req, res) => {
  try {
    console.log("Export individuel reçu →", req.params.eleveId, req.query);
    const { eleveId } = req.params;
    const { mois, annee, anneeScolaire } = req.query;

    const filtre = {
      eleve: eleveId,
      comptable: new mongoose.Types.ObjectId(req.user.id),
    };

    if (anneeScolaire) filtre.anneeScolaire = anneeScolaire;

    if (mois && annee) {
      const moisMap = {
        Janvier: 0, Février: 1, Mars: 2, Avril: 3, Mai: 4, Juin: 5,
        Juillet: 6, Août: 7, Septembre: 8, Octobre: 9, Novembre: 10, Décembre: 11,
      };
      const moisIndex = moisMap[mois];
      if (moisIndex === undefined) {
        return res.status(400).json({ error: "Mois invalide" });
      }
      const debut = new Date(annee, moisIndex, 1);
      const fin = new Date(annee, moisIndex + 1, 1);
      filtre.datePaiement = { $gte: debut, $lt: fin };
    }

    const paiements = await Paiement.find(filtre)
      .populate("eleve", "nom prenom matricule")
      .populate("comptable", "nom prenom");

    const eleve = await Eleve.findById(eleveId).select("nom prenom matricule");
    if (!eleve) return res.status(404).json({ error: "Élève introuvable" });

    const doc = new PDFDocument({ margin: 40 });
    const filename = `Releve_${eleve.nom}_${mois || "Tous"}_${annee || ""}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    doc.pipe(res);

    // 🧾 En-tête
    doc.font("Helvetica-Bold").fontSize(16).text(`Relevé de Paiements mensuel`, { align: "center" });
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12).text(`Élève :`, { continued: true });
    doc.font("Helvetica").text(` ${eleve.nom} ${eleve.prenom} (${eleve.matricule})`);
    doc.moveDown(0.5);
    if (anneeScolaire) {
      doc.font("Helvetica-Bold").text(`Année scolaire :`, { continued: true });
      doc.font("Helvetica").text(` ${anneeScolaire}`);
    }
    doc.moveDown(0.5);
    if (mois && annee) {
      doc.font("Helvetica-Bold").text(`Période :`, { continued: true });
      doc.font("Helvetica").text(` ${mois} / ${annee}`);
    }
    doc.moveDown();
    // 📊 Tableau
    const columns = [
      { label: "Date", width: 70 },
      { label: "Motif", width: 100 },
      { label: "Montant", width: 80 },
      { label: "Mode", width: 80 },
      { label: "Statut", width: 80 },
    ];

    const startX = doc.x;
    let startY = doc.y;
    const rowHeight = 20;

    doc.font("Helvetica-Bold").fontSize(10);
    columns.forEach((col, i) => {
      const x = startX + columns.slice(0, i).reduce((a, c) => a + c.width, 0);
      doc.rect(x, startY, col.width, rowHeight).stroke();
      doc.text(col.label, x + 5, startY + 5, { width: col.width - 10, align: "left" });
    });

    startY += rowHeight;
    doc.font("Helvetica").fontSize(9);
    let total = 0;

    paiements.forEach((p) => {
      const values = [
        p.datePaiement?.toLocaleDateString() || "—",
        p.motif || "—",
        p.montant ? `${p.montant.toLocaleString("fr-FR").replace(/\u202f/g, ' ')} GNF` : "—",
        p.modePaiement || "—",
        p.statut || "—",
      ];

      columns.forEach((col, i) => {
        const x = startX + columns.slice(0, i).reduce((a, c) => a + c.width, 0);
        doc.rect(x, startY, col.width, rowHeight).stroke();
        doc.text(values[i], x + 5, startY + 5, { width: col.width - 10, align: "left" });
      });

      startY += rowHeight;
      total += p.montant || 0;

      if (startY + rowHeight > doc.page.height - 50) {
        doc.addPage();
        startY = doc.y;
      }
    });

    doc.moveDown(2);
    doc.fontSize(12).text(`Total encaissé : ${total.toLocaleString("fr-FR").replace(/\u202f/g, ' ')} GNF`, { align: "right" });
    doc.end();
  } catch (err) {
    console.error("Erreur export individuel:", err);
    res.status(500).json({ error: "Erreur export individuel", details: err.message });
  }
};



exports.exportHistoriquePaiements = async (req, res) => {
  try {
    const { eleveId } = req.params;

    const filtre = {
      eleve: eleveId,
      comptable: new mongoose.Types.ObjectId(req.user.id),
    };

    const paiements = await Paiement.find(filtre)
      .populate("eleve", "nom prenom matricule")
      .populate("comptable", "nom prenom")
      .sort({ datePaiement: 1 });

    const eleve = await Eleve.findById(eleveId).select("nom prenom matricule");
    const doc = new PDFDocument({ margin: 40 });
    const filename = `Historique_Paiements_${eleve.nom}_${eleve.matricule}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    doc.pipe(res);

    // 🧾 En-tête
    doc.fontSize(16).text(`Historique Complet des Paiements`, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Élève : ${eleve.nom} ${eleve.prenom} (${eleve.matricule})`);
    doc.text(`Total de paiements enregistrés : ${paiements.length}`);
    doc.moveDown();

    // 📊 Tableau
    const columns = [
      { label: "Date", width: 70 },
      { label: "Motif", width: 80 },
      { label: "Montant", width: 80 },
      { label: "Mode", width: 80 },
      { label: "Statut", width: 80 },
      { label: "Année scolaire", width: 100 },
    ];

    const startX = doc.x;
    let startY = doc.y;
    const rowHeight = 20;

    doc.font("Helvetica-Bold").fontSize(10);
    columns.forEach((col, i) => {
      doc.rect(startX + columns.slice(0, i).reduce((a, c) => a + c.width, 0), startY, col.width, rowHeight).stroke();
      doc.text(col.label, startX + columns.slice(0, i).reduce((a, c) => a + c.width, 0) + 5, startY + 5, {
        width: col.width - 10,
        align: "left",
      });
    });

    startY += rowHeight;
    doc.font("Helvetica").fontSize(9);
    let total = 0;

    paiements.forEach((p) => {
      const values = [
        p.datePaiement?.toLocaleDateString() || "—",
        p.motif || "—",
        p.montant ? `${p.montant.toLocaleString("fr-FR").replace(/\u202f/g, ' ')} GNF` : "—",
        p.modePaiement || "—",
        p.statut || "—",
        p.anneeScolaire || "—",
      ];

      columns.forEach((col, i) => {
        doc.rect(startX + columns.slice(0, i).reduce((a, c) => a + c.width, 0), startY, col.width, rowHeight).stroke();
        doc.text(values[i], startX + columns.slice(0, i).reduce((a, c) => a + c.width, 0) + 5, startY + 5, {
          width: col.width - 10,
          align: "left",
        });
      });

      startY += rowHeight;
      total += p.montant || 0;

      if (startY + rowHeight > doc.page.height - 50) {
        doc.addPage();
        startY = doc.y;
      }
    });

    doc.moveDown(2);
    doc.fontSize(12).text(`Total encaissé : ${total.toLocaleString("fr-FR").replace(/\u202f/g, ' ')} GNF`, { align: "right" });
    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Erreur export historique", details: err.message });
  }
};