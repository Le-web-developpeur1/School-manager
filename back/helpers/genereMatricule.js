const Eleve = require('../models/Eleve');

async function genereMatricule (anneeScolaire) {
    //Compter les élèves déjà enregistrés pour cette année
    const count = await Eleve.countDocuments({ anneeScolaire });

    const numero = String(count + 1).padStart(3, '0');
    const matricule = `EL${anneeScolaire.replace('-', '')}-${numero}`;

    return matricule;
}

module.exports = genereMatricule;