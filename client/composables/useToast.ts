export const useToast = () => {
  const showSuccess = (message: string) => {
    console.log('SUCCESS:', message);
  };

  const showError = (message: string) => {
    console.error('ERROR:', message);
  };

  const showInfo = (message: string) => {
    console.log('INFO:', message);
  };

  const showWarning = (message: string) => {
    console.warn('WARNING:', message);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
