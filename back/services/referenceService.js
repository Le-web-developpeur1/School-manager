const { v4: uuidv4 } = require('uuid');

exports.genererReferencePaiement = () => {
    const prefix = 'PAY';
    const timestamps = Date.now().toString().slice(-6);
    const uniqueId = uuidv4().split('-')[0].toUpperCase();
    return `${prefix}-${timestamps}-${uniqueId}`;
};