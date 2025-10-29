/**
 * Social authentication utilities
 * Handles OAuth login flows for various providers
 */

const API_BASE_URL = "https://weather-api.webmania.ge/api/v1/auth";

/**
 * Supported OAuth providers
 */
export const SocialProviders = {
  GOOGLE: "google",
  FACEBOOK: "facebook",
};

/**
 * Open OAuth popup window for social login (DEPRECATED - use redirectToSocialLogin instead)
 * @param {string} provider - OAuth provider (google, facebook, etc.)
 * @param {Object} options - Additional options
 * @param {string} options.width - Popup width
 * @param {string} options.height - Popup height
 * @returns {Window|null} popup window reference
 * @deprecated Use redirectToSocialLogin for better compatibility
 */
export const openSocialLoginPopup = (provider, options = {}) => {
  const { width = 500, height = 600 } = options;

  if (!provider) {
    console.error("Social provider is required");
    return null;
  }

  const url = `${API_BASE_URL}/${provider}/redirect`;
  const windowFeatures = `width=${width},height=${height},scrollbars=yes`;

  try {
    return window.open(url, `${provider}_oauth`, windowFeatures);
  } catch (error) {
    console.error(`Failed to open ${provider} login popup:`, error);
    return null;
  }
};

/**
 * Redirect to OAuth provider for social login
 * @param {string} provider - OAuth provider (google, facebook, etc.)
 * @param {string} returnUrl - URL to return to after authentication
 */
export const redirectToSocialLogin = (provider, returnUrl) => {
  if (!provider) {
    console.error("Social provider is required");
    return;
  }

  const origin = returnUrl || window.location.origin;
  const url = `${API_BASE_URL}/${provider}/redirect?origin=${encodeURIComponent(origin)}`;

  try {
    window.location.href = url;
  } catch (error) {
    console.error(`Failed to redirect to ${provider} login:`, error);
  }
};

/**
 * Handle Google login via redirect
 */
export const handleGoogleLogin = () => {
  return redirectToSocialLogin(SocialProviders.GOOGLE, window.location.origin);
};

/**
 * Handle Facebook login via redirect
 */
export const handleFacebookLogin = () => {
  return redirectToSocialLogin(SocialProviders.FACEBOOK, window.location.origin);
};