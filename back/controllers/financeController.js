const Eleve = require('../models/Eleve');
const Paiement = require('../models/Paiement');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

exports.creerPaiement = async (req, res) => {
    try {
        const { eleve, montant, motif, anneeScolaire, datePaiement } = req.body;
        const comptable = req.user.id;
        const paiement = await Paiement.create({ 
            eleve, 
            montant, 
            motif, 
            anneeScolaire,
            datePaiement, 
            comptable 
        });
        res.status(201).json({ success: true, paiement });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur d'ajout paiement", erreur: error.message });
    }
};

exports.listerPaiements = async (req, res) => {
    try {
       const filtre = {};

       if (req.query.eleve) {
        filtre.eleve = req.query.eleve;
       }

       if (req.query.anneeScolaire) {
        filtre.anneeScolaire = req.query.anneeScolaire;
       }

       const paiements = await Paiement.find(filtre)
        .populate('eleve', 'nom prenom matricule')
        .populate('comptable', 'nom');

        res.status(200).json({ success: true, paiements });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des paiements", erreur: error.message });
    }
};

exports.releveEleve = async (req, res) => {
    try {
        const { eleveId } = req.params;
        const { anneeScolaire } = req.query;

        //Le filtre de base
        const filtre = { eleve: eleveId };

        //Si une année scolaire est précisée, on l'ajoute au filtre
        if (anneeScolaire) {
            filtre.anneeScolaire = anneeScolaire;
        }

        //Récupération des paiements selon les critères
        const paiements = await Paiement.find(filtre)
            .populate('comptable', 'nom')
            .sort({ datePaiement: 1 });

        //Calcul du total encaissé
        const total = paiements.reduce((acc, p) => acc + p.montant, 0);
        
        res.status(200).json({
            success: true,
            eleve: eleveId,
            anneeScolaire: anneeScolaire || 'toutes',
            total,
            paiements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            erreur: error.message
        });
    }
};

exports.totalParClasse = async (req, res) => {
    try {
        const { classeId } = req.params;
        const { anneeScolaire, mois, annee } = req.query;

        //Récupération des éleves de chaque classe
        const eleveDeLaClasse = await Eleve.find({ classe: classeId }, '_id');

        //Extration des IDs des élèves
        const idEleves = eleveDeLaClasse.map(e => e._id);

        //Construction du filtre
        const filtrePaiement = { eleve: { $in: idEleves } };

        //Filtre par année scolaire si fourni
        if (anneeScolaire) {
            filtrePaiement.anneeScolaire = anneeScolaire;
        }

        //Filtre mensuel si mois + année sont fournis
        if (mois && annee) {
            const debut = new Date(annee, mois - 1, 1);
            const fin = new Date(annee, mois, 1);
            filtrePaiement.datePaiement = { $gte: debut, $lt: fin };
        }

        //Récupération de tous les paiements liés
        const paiements = await Paiement.find(filtrePaiement);

        //Total encaissé
        const total = paiements.reduce((acc, p) => acc + p.montant, 0);

        res.status(200).json({
            success: true,
            classe: classeId,
            anneeScolaire: anneeScolaire || 'toutes',
            mois: mois ? parseInt(mois) : 'tous',
            annee: annee || 'toutes',
            total,
            nombrePaiements: paiements.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            erreur: error.message
        });
    }
};

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

exports.exportRelevePdf = async (req, res) => {
    try {
        const { eleveId } = req.params;
        const { anneeScolaire } = req.query;

        const filtre = { eleve: eleveId };
        if (anneeScolaire) {
            filtre.anneeScolaire = anneeScolaire;
        }

        const paiements = await Paiement.find(filtre)
            .populate('eleve', 'nom prenom matricule')
            .populate('comptable', 'nom')
            .sort({ datePaiement: 1 });
        
        const doc = new PDFDocument();
        const filename = `Releve_${paiements[0]?.eleve?.nom || 'eleve'}.pdf`;

        //Configurations des headers pour le téléchargement
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachement; filename="${filename}"`);

        //Génération du contenu PDF
        doc.pipe(res);
        doc.fontSize(18).text('Relevé de Paiements', { align: 'center' });
        doc.moveDown();

        //Infos élève
        const e = paiements[0]?.eleve;
        if (e) {
            doc.fontSize(12).text(`Nom : ${e.nom}`);
            doc.text(`Prénom : ${e.prenom}`);
            doc.text(`Matricule :  ${e.matricule}`);
        }

        if (anneeScolaire) {
            doc.text(`Année Scolaire : ${anneeScolaire}`);
            doc.moveDown();
        }

        //Paiements
        let total = 0;
        paiements.forEach(p => {
            doc.text(`${p.datePaiement.toLocaleDateString()} - ${p.motif} - ${p.montant} GNF - Comptable ${p.comptable?.nom || '---'}`);
            total += p.montant;
        });

        doc.moveDown();
        doc.fontSize(14).text(`Total encaissé : ${total} GNF`, { align: 'right' });
        doc.end();
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur génération PDF", erreur: error.message });
    }
};