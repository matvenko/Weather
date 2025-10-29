/**
 * Authentication utility functions
 * Provides centralized auth state management and checks
 */

/**
 * Check if user is authorized (has valid token)
 * @returns {boolean} true if user has valid token
 */
export const isAuthorized = () => {
  const token = localStorage.getItem("token");
  return !!token && token.trim() !== "";
};

/**
 * Get current user token
 * @returns {string|null} token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

/**
 * Get current username
 * @returns {string|null} username or null
 */
export const getUsername = () => {
  return localStorage.getItem("userName");
};

/**
 * Get user permissions from session storage
 * @returns {Array} array of permissions
 */
export const getUserPermissions = () => {
  try {
    const permissions = sessionStorage.getItem("permissions");
    return permissions ? JSON.parse(permissions) : [];
  } catch (error) {
    console.error("Error parsing permissions:", error);
    return [];
  }
};

/**
 * Get user config from session storage
 * @returns {Object|null} user config or null
 */
export const getUserConfig = () => {
  try {
    const config = sessionStorage.getItem("userConfig");
    return config ? JSON.parse(config) : null;
  } catch (error) {
    console.error("Error parsing user config:", error);
    return null;
  }
};

/**
 * Check if user has specific permission
 * @param {string} permission - permission to check
 * @returns {boolean} true if user has permission
 */
export const hasPermission = (permission) => {
  const permissions = getUserPermissions();
  return permissions.includes(permission);
};

/**
 * Clear all auth data from storage
 */
export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  sessionStorage.removeItem("permissions");
  sessionStorage.removeItem("userConfig");
};

/**
 * Store auth credentials
 * @param {Object} credentials - auth credentials
 * @param {string} credentials.token - access token
 * @param {string} credentials.userName - username
 * @param {Array} [credentials.permissions] - user permissions
 * @param {Object} [credentials.userConfig] - user config
 */
export const storeAuthCredentials = ({ token, userName, permissions, userConfig }) => {
  if (token) {
    localStorage.setItem("token", token);
  }
  if (userName) {
    localStorage.setItem("userName", userName);
  }
  if (permissions) {
    sessionStorage.setItem("permissions", JSON.stringify(permissions));
  }
  if (userConfig) {
    sessionStorage.setItem("userConfig", JSON.stringify(userConfig));
  }
};
