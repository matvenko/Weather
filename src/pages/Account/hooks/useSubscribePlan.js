import { useMutation, useQueryClient } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";
import { message } from "antd";

/**
 * Custom hook to subscribe to a plan
 * @returns {Object} mutation object with subscribe function
 */
export const useSubscribePlan = () => {
  const queryClient = useQueryClient();

  const subscribeToPlan = async (subscriptionData) => {
    const response = await privateAxios.post(
      "/api/v1/subscription/subscribe",
      subscriptionData
    );
    return response.data;
  };

  return useMutation({
    mutationFn: subscribeToPlan,
    onSuccess: (data) => {
      // Invalidate user subscriptions query to refetch
      queryClient.invalidateQueries(["user-subscriptions"]);

      message.success({
        content: data.message || "Successfully subscribed to plan!",
        duration: 3,
      });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to subscribe to plan";

      message.error({
        content: errorMessage,
        duration: 4,
      });
    },
  });
};
