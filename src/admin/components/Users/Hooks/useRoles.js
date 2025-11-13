import { useQuery } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";

/**
 * Custom hook to fetch roles from the API
 */
export const useRoles = () => {
  const fetchRoles = async () => {
    const response = await privateAxios.get("/api/v1/role/get-roles");
    return response.data;
  };

  return useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    staleTime: 5 * 60 * 1000, // 5 minutes - roles don't change often
  });
};
