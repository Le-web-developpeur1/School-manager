const express = require("express");
const router = express.Router();
const { creerAnneeScolaire, activerAnneeScolaire } = require("../controllers/anneeScolaireController");

router.post("/", creerAnneeScolaire);
router.put("/activer/:id", activerAnneeScolaire);

module.exports = router;
