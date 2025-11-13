import { useContext } from "react";
import { PermissionsContext } from "./PermissionsContext.js";

/**
 * Hook to access permissions context
 * Must be used within PermissionsProvider
 */
export const usePermissions = () => {
  const context = useContext(PermissionsContext);

  if (!context) {
    throw new Error("usePermissions must be used within PermissionsProvider");
  }

  return context;
};
