import { useMutation } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";

/**
 * Custom hook to block a user
 * @param {number} userId - User ID to block
 */
export const useBlockUser = () => {
  const blockUser = async (userId) => {
    const response = await privateAxios.post("/api/v1/user/close-user", {
      userId,
    });
    return response.data;
  };

  return useMutation({
    mutationFn: blockUser,
  });
};
