import { useMutation, useQueryClient } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";
import { message } from "antd";

/**
 * Custom hook to renew a subscription
 * @returns {Object} mutation object with renew function
 */
export const useRenewSubscription = () => {
  const queryClient = useQueryClient();

  const renewSubscription = async (renewalData) => {
    const response = await privateAxios.post(
      "/api/v1/subscription/renew",
      renewalData
    );
    return response.data;
  };

  return useMutation({
    mutationFn: renewSubscription,
    onSuccess: (data) => {
      // Invalidate user subscriptions query to refetch
      queryClient.invalidateQueries(["user-subscriptions"]);

      message.success({
        content: data.message || "Successfully renewed subscription!",
        duration: 3,
      });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to renew subscription";

      message.error({
        content: errorMessage,
        duration: 4,
      });
    },
  });
};
