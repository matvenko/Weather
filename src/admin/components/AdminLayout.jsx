import React from "react";
import { Outlet } from "react-router-dom";
import { PermissionsProvider } from "@src/admin/providers/PermissionsProvider/index.js";

/**
 * AdminLayout - Wraps all admin pages with PermissionsProvider
 * Ensures all admin components have access to user permissions
 */
const AdminLayout = () => {
  return (
    <PermissionsProvider>
      <Outlet />
    </PermissionsProvider>
  );
};

export default AdminLayout;
