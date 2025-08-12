const errorHandler = (err, req, res, next) => {
    console.error('🔥 ERREUR INTERCEPTÉE 🔥');
    console.error('📍 Message:', err.message);
    console.error('📁 Fichier:', err.stack?.split('\n')[1]?.trim());
    console.error('🧠 Stack complète:\n', err.stack);
  
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Erreur serveur',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
  