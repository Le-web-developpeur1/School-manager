const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    if (req.user && req.user.role === "comptable") {
        req.filtreComptable = { comptable: new mongoose.Types.ObjectId(req.user.id) };
    } else {
        req.filtreComptable = {};
    }
    next();
};
