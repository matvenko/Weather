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
    console.log('closeSubscription called with ID:', subscriptionId);
    const payload = { subscriptionId: String(subscriptionId) };
    console.log('Sending payload to API:', payload);

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
      console.error('Close subscription error:', error);
      console.error('Error response:', error?.response);
      console.error('Error response data:', error?.response?.data);

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
