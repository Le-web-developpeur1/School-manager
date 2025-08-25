const Eleve = require('../models/Eleve');

async function genereMatricule (anneeScolaire) {
    let tentative = 1;
    let matricule;

    while (true) {
        //Compter les élèves déjà enregistrés pour cette année
        const count = await Eleve.countDocuments({ anneeScolaire });
        const numero = String(count + tentative).padStart(3, '0');
        matricule = `EL${anneeScolaire.replace('-', '')}-${numero}`;
    
        const existe = await Eleve.findOne({ matricule });
        if (!existe) break;
    
        tentative++;
      }
    
      return matricule;
}

module.exports = genereMatricule;