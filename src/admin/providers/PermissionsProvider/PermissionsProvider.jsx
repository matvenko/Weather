import React, { useMemo } from "react";
import { PermissionsContext } from "./PermissionsContext.js";
import { useUserPermissions } from "@src/admin/hooks/useUserPermissions.js";

/**
 * PermissionsProvider - Manages user permissions for admin panel
 * Provides permission checking utilities to all child components
 */
export const PermissionsProvider = ({ children }) => {
  const { data, isLoading, error } = useUserPermissions();

  const permissions = useMemo(() => {
    return data?.permissions || [];
  }, [data]);

  /**
   * Check if user has specific action permission for a page
   * @param {string} pageUrl - The page URL (e.g., 'users')
   * @param {string} action - The action name (e.g., 'exportUsers')
   * @returns {boolean}
   */
  const hasPermission = useMemo(
    () => (pageUrl, action) => {
      const page = permissions.find((p) => p.pageUrl === pageUrl);
      if (!page) return false;

      return page.permissions?.some((perm) => perm.action === action) || false;
    },
    [permissions]
  );

  /**
   * Check if page should be visible in menu
   * @param {string} pageUrl - The page URL (e.g., 'users')
   * @returns {boolean}
   */
  const isPageVisible = useMemo(
    () => (pageUrl) => {
      const page = permissions.find((p) => p.pageUrl === pageUrl);
      return page?.visible === "Y";
    },
    [permissions]
  );

  /**
   * Get all permissions for a specific page
   * @param {string} pageUrl - The page URL (e.g., 'users')
   * @returns {Array}
   */
  const getPagePermissions = useMemo(
    () => (pageUrl) => {
      const page = permissions.find((p) => p.pageUrl === pageUrl);
      return page?.permissions || [];
    },
    [permissions]
  );

  /**
   * Get page data including children
   * @param {string} pageUrl - The page URL
   * @returns {Object|null}
   */
  const getPageData = useMemo(
    () => (pageUrl) => {
      return permissions.find((p) => p.pageUrl === pageUrl) || null;
    },
    [permissions]
  );

  const value = useMemo(
    () => ({
      permissions,
      isLoading,
      error,
      hasPermission,
      isPageVisible,
      getPagePermissions,
      getPageData,
    }),
    [permissions, isLoading, error, hasPermission, isPageVisible, getPagePermissions, getPageData]
  );

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
};
