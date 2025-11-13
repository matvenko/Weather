import { createContext } from "react";

/**
 * Context for managing user permissions in admin panel
 */
export const PermissionsContext = createContext({
  permissions: [],
  isLoading: false,
  error: null,
  hasPermission: () => false,
  isPageVisible: () => false,
  getPagePermissions: () => [],
});
