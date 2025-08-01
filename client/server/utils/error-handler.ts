import { createError } from 'h3';

export function handleApiError(error: any, defaultMessage: string) {
  console.error('Erreur API backend:', error);
  
  // Log détaillé de l'erreur
  if (error.data) {
    console.error('Données d\'erreur:', error.data);
  }
  if (error.status) {
    console.error('Status d\'erreur:', error.status);
  }
  if (error.message) {
    console.error('Message d\'erreur:', error.message);
  }

  // Extraire le message d'erreur de manière sécurisée
  let errorMessage = defaultMessage;
  
  if (error.data?.message) {
    if (Array.isArray(error.data.message)) {
      errorMessage = error.data.message.join(', ');
    } else if (typeof error.data.message === 'string') {
      errorMessage = error.data.message;
    }
  } else if (error.message && typeof error.message === 'string') {
    errorMessage = error.message;
  }

  throw createError({
    statusCode: error.status || error.statusCode || 500,
    statusMessage: errorMessage,
  });
} 