import { useQuery } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";

/**
 * Custom hook to fetch user permissions from the API
 * Returns permissions structure with pages and their associated actions
 */
export const useUserPermissions = () => {
  const fetchPermissions = async () => {
    const response = await privateAxios.get("/api/v1/permissions/get_user_permissions");
    return response.data;
  };

  return useQuery({
    queryKey: ["userPermissions"],
    queryFn: fetchPermissions,
    staleTime: 10 * 60 * 1000, // 10 minutes - permissions don't change frequently
    cacheTime: 15 * 60 * 1000, // 15 minutes
  });
};
