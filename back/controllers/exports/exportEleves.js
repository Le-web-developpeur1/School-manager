const ExcelJS = require('exceljs');
const Eleve = require('../../models/Eleve');

exports.exporterListeEleves = async (req, res) => {
  try {
    const eleves = await Eleve.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Liste des élèves');

    worksheet.columns = [
      { header: 'Nom', key: 'nom', width: 20 },
      { header: 'Prénom', key: 'prenom', width: 20 },
      { header: 'Matricule', key: 'matricule', width: 15 },
      { header: 'Classe', key: 'classe', width: 15 },
      { header: 'Sexe', key: 'sexe', width: 10 },
    ];

    eleves.forEach(eleve => worksheet.addRow(eleve));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=eleves.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur export élèves", erreur: error.message });
  }
};
