export const preventCopy = (e) => {
  e.preventDefault();
  return false;
};

export const setupSecurityListeners = (doc = document) => {
  const preventDefaultBehavior = (e) => {
    e.preventDefault();
    return false;
  };

  // Add event listeners to the provided document
  doc.addEventListener('copy', preventDefaultBehavior);
  doc.addEventListener('cut', preventDefaultBehavior);
  doc.addEventListener('paste', preventDefaultBehavior);
  doc.addEventListener('contextmenu', preventDefaultBehavior);
  doc.addEventListener('selectstart', preventDefaultBehavior); // Prevent text selection
  doc.addEventListener('keydown', (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === 'c' || e.key === 'C' ||
       e.key === 'v' || e.key === 'V' ||
       e.key === 'p' || e.key === 'P' ||
       e.key === 's' || e.key === 'S')
    ) {
      e.preventDefault();
    }
  });

  // Return cleanup function if needed
  return () => {
    doc.removeEventListener('copy', preventDefaultBehavior);
    doc.removeEventListener('cut', preventDefaultBehavior);
    doc.removeEventListener('paste', preventDefaultBehavior);
    doc.removeEventListener('contextmenu', preventDefaultBehavior);
    doc.removeEventListener('selectstart', preventDefaultBehavior);
  };
};
