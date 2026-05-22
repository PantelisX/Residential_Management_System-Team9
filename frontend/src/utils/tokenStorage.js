/**
 * Get JWT token from localStorage
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Save JWT token to localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Check if token exists
 * @returns {boolean}
 */
export const hasToken = () => {
  return Boolean(getToken());
};
