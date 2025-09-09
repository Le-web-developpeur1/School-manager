const PDFDocument = require("pdfkit");
const path = require("path");

const genereRecuPDF = (paiement, res) => {
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=recu.pdf");

  doc.pipe(res);

  const logoPath = path.join(__dirname, "../assets/logo.png");

  const drawRecu = (label, yOffset) => {
    doc.y = yOffset;

    // 🔹 Logo
    try {
      doc.image(logoPath, doc.x, doc.y, { width: 100 });
    } catch {
      doc.fontSize(10).fillColor("gray").text("[Logo manquant]", { align: "left" });
    }

    // 🔹 Titre
    doc.moveDown(0.8);
    doc.fontSize(16).font("Helvetica-Bold").text("Reçu de Paiement", { align: "center" });
    doc.moveDown(0.2);
    doc.fontSize(11).font("Helvetica").text(label, { align: "center" });
    doc.moveDown(1.2);

    // 🔹 Infos centrées
    const x = 100; // 🔹 position horizontale fixe
    const lignes = [
      ["N° Reçu", `REC-${new Date().getFullYear()}-${String(paiement._id).slice(-5)}`],
      ["Date", new Date(paiement.datePaiement).toLocaleDateString()],
      ["Élève", `${paiement.eleve?.nom || "—"} ${paiement.eleve?.prenom || "—"}`],
      ["Matricule", paiement.eleve?.matricule || "—"],
      ["Classe", paiement.eleve?.classe?.nom || "—"],
      ["Mois", paiement.mois || "—"],
      ["Motif", paiement.motif || "—"],
      ["Mode de paiement", paiement.modePaiement || "—"],
      ["Montant", `${paiement.montant?.toLocaleString()} GNF`]
    ];

    lignes.forEach(([label, value]) => {
      doc.font("Helvetica-Bold").fontSize(11).text(`${label} :`, x, doc.y, { continued: true });
      doc.font("Helvetica").text(` ${value}`);
      doc.moveDown(0.5);
    });

    // 🔹 Comptable
    doc.moveDown(1.5);
    doc.font("Helvetica-Bold").text("Comptable", { align: "right" });
    doc.moveDown(0.3);
    doc.font("Helvetica").text(`${paiement.comptable?.nom || "—"} ${paiement.comptable?.prenom || ""}`, { align: "right" });
    doc.moveDown(1.5);

    // 🔹 Ligne de séparation
    doc.moveDown(1.2);
    doc.moveTo(doc.page.margins.left, doc.y)
       .lineTo(doc.page.width - doc.page.margins.right, doc.y)
       .strokeColor("#999")
       .lineWidth(0.5)
       .stroke();
  };

  drawRecu("ORIGINAL", 50);
  drawRecu("COPIE", 420);

  doc.end();
};

module.exports = { genereRecuPDF };
