export const getCurrentUser = () => {
  try {
    const userRaw = localStorage.getItem('user');
    return userRaw ? JSON.parse(userRaw) : null;
  } catch {
    return null;
  }
};

export const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user?.id_user || null;
};
