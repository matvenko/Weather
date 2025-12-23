import { useMutation } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";
import { message } from "antd";

/**
 * Custom hook to buy a package
 * @returns {Object} mutation object with buy function
 */
export const useBuyPackage = () => {
  const buyPackage = async (packageData) => {
    const response = await privateAxios.post(
      "/api/v1/billing/buy-package",
      packageData
    );
    return response.data;
  };

  return useMutation({
    mutationFn: buyPackage,
    onSuccess: (data) => {
      // Redirect to payment URL
      if (data.message && typeof data.message === "string") {
        window.location.href = data.message;
      }
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "პაკეტის ყიდვა ვერ მოხერხდა";

      message.error({
        content: errorMessage,
        duration: 4,
      });
    },
  });
};
