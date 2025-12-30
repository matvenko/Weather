import { useMutation } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";

/**
 * Custom hook to cancel a subscription
 * @returns {Object} mutation object with cancel function
 */
export const useCancelSubscription = () => {
  const cancelSubscription = async (subscriptionId) => {
    const response = await privateAxios.post(
      "/api/v1/subscription/close-user-subscription",
      { subscriptionId }
    );
    return response.data;
  };

  return useMutation({
    mutationFn: cancelSubscription,
  });
};
