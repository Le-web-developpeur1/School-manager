import toast from 'react-hot-toast';

const toastService = {
  success: (message = 'Opération réussie') => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
    });
  },

  error: (message = 'Une erreur est survenue ') => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
    });
  },

  info: (message = 'Information') => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
    });
  }
};

export default toastService;
