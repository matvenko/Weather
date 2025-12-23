import { useQuery } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";

/**
 * Custom hook to fetch available packages from the API
 * @returns {Object} query object with packages data
 */
export const usePackages = () => {
  const fetchPackages = async () => {
    const response = await privateAxios.get("/api/v1/package/get-packages");
    return response.data;
  };

  return useQuery({
    queryKey: ["packages"],
    queryFn: fetchPackages,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
