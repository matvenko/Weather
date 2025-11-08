import { useMutation } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";

/**
 * Custom hook to change user role
 * @param {Object} params - Parameters
 * @param {number} params.userId - User ID
 * @param {number} params.roleId - Role ID (1: Admin, 2: User)
 */
export const useChangeRole = () => {
  const changeRole = async ({ userId, roleId }) => {
    const response = await privateAxios.post("/api/v1/user/change-role", {
      userId,
      roleId,
    });
    return response.data;
  };

  return useMutation({
    mutationFn: changeRole,
  });
};
