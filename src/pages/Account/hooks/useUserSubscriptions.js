import { useQuery } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";

/**
 * Custom hook to fetch user subscriptions from the API
 * @param {Object} params - Query parameters
 * @param {string} params.id - Subscription ID
 * @param {string} params.masterId - Master ID
 * @param {string} params.email - User email
 * @param {string} params.packageId - Package ID
 * @param {string} params.periodStart - Period start date
 * @param {string} params.periodEnd - Period end date
 * @param {string} params.status - Subscription status (A=Active, I=Inactive)
 * @param {number} params.page - Current page number
 * @param {number} params.per_page - Items per page
 */
export const useUserSubscriptions = (params = {}) => {
  const {
    id = "",
    masterId = "",
    email = "",
    packageId = "",
    periodStart = "",
    periodEnd = "",
    status = "A", // Default to Active subscriptions
    page = 1,
    per_page = 10,
  } = params;

  const fetchUserSubscriptions = async () => {
    const response = await privateAxios.get(
      "/api/v1/subscription/get-user-subscriptions",
      {
        params: {
          id,
          masterId,
          email,
          packageId,
          periodStart,
          periodEnd,
          status,
          page,
          per_page,
        },
      }
    );
    return response.data;
  };

  return useQuery({
    queryKey: [
      "user-subscriptions",
      id,
      masterId,
      email,
      packageId,
      periodStart,
      periodEnd,
      status,
      page,
      per_page,
    ],
    queryFn: fetchUserSubscriptions,
    enabled: true, // Can be controlled based on user authentication
    keepPreviousData: true,
  });
};
