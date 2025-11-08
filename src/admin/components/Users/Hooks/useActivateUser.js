import { useMutation } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";

/**
 * Custom hook to activate a user
 * @param {number} userId - User ID to activate
 */
export const useActivateUser = () => {
  const activateUser = async (userId) => {
    const response = await privateAxios.post("/api/v1/user/recover-user", {
      userId,
    });
    return response.data;
  };

  return useMutation({
    mutationFn: activateUser,
  });
};
