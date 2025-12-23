import { useQuery } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";

/**
 * Custom hook to fetch current and next subscription for the user
 * @returns {Object} query object with current and next subscription data
 */
export const useCurrentSubscription = () => {
  const fetchCurrentSubscription = async () => {
    const response = await privateAxios.get(
      "/api/v1/subscription/get-subscriptions-current-and-next"
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["current-subscription"],
    queryFn: fetchCurrentSubscription,
    staleTime: 1000 * 60, // 1 minute
  });
};
