/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength level and message
 */
export const validatePassword = (password) => {
  const result = {
    isValid: false,
    strength: 'weak',
    message: ''
  };

  if (password.length < 6) {
    result.message = 'Password must be at least 6 characters';
    return result;
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  if (score <= 1) {
    result.strength = 'weak';
  } else if (score <= 2) {
    result.strength = 'fair';
  } else if (score <= 3) {
    result.strength = 'good';
  } else {
    result.strength = 'strong';
  }

  result.isValid = true;
  result.message = `Password strength: ${result.strength}`;
  return result;
};

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {boolean}
 */
export const isValidUsername = (username) => {
  return username.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(username);
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @returns {boolean}
 */
export const isRequired = (value) => {
  return value && value.trim().length > 0;
};
