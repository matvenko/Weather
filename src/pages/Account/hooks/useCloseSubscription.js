import { useMutation, useQueryClient } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";
import { message } from "antd";

/**
 * Custom hook to close/cancel a subscription
 * @returns {Object} mutation object with close function
 */
export const useCloseSubscription = () => {
  const queryClient = useQueryClient();

  const closeSubscription = async (subscriptionId) => {
    const payload = { subscriptionId: String(subscriptionId) };
    const response = await privateAxios.post("/api/v1/subscription/close", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: closeSubscription,
    onSuccess: (data) => {
      // Invalidate current subscription query to refetch
      queryClient.invalidateQueries(["current-subscription"]);

      message.success({
        content: data.message || "სუბსკრიფშენი წარმატებით გაუქმდა!",
        duration: 3,
      });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "სუბსკრიფშენის გაუქმება ვერ მოხერხდა";

      message.error({
        content: errorMessage,
        duration: 4,
      });
    },
  });
};
