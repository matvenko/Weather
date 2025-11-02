import { useQuery } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";

/**
 * Custom hook to fetch users from the API
 * @param {Object} params - Query parameters
 * @param {string} params.email - Filter by email
 * @param {string} params.provider - Filter by provider
 * @param {number} params.roleId - Filter by role ID
 * @param {string} params.status - Filter by status
 * @param {number} params.packageId - Filter by package ID
 * @param {number} params.page - Current page number
 * @param {number} params.per_page - Items per page
 */
export const useUsers = (params = {}) => {
  const {
    email = "",
    provider = "",
    roleId = "",
    status = "",
    packageId = "",
    page = 1,
    per_page = 10,
  } = params;

  const fetchUsers = async () => {
    const response = await privateAxios.get("/api/v1/user/get-users", {
      params: {
        email,
        provider,
        roleId,
        status,
        packageId,
        page,
        per_page,
      },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["users", email, provider, roleId, status, packageId, page, per_page],
    queryFn: fetchUsers,
    keepPreviousData: true,
  });
};
