import { useMutation } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";
import { message } from "antd";

/**
 * Custom hook to export users to Excel
 * @param {Object} params - Query parameters
 * @param {string} params.email - Filter by email
 * @param {string} params.provider - Filter by provider
 * @param {number} params.roleId - Filter by role ID
 * @param {string} params.status - Filter by status
 * @param {number} params.packageId - Filter by package ID
 * @param {number} params.page - Current page number
 * @param {number} params.per_page - Items per page
 */
export const useExportUsers = () => {
  const exportUsers = async (params) => {
    const {
      email = "",
      provider = "",
      roleId = "",
      status = "",
      packageId = "",
      page = 1,
      per_page = 10,
    } = params;

    try {
      // Backend returns JSON with base64-encoded Excel file
      const response = await privateAxios.get("/api/v1/user/export-users", {
        params: {
          email,
          provider,
          roleId,
          status,
          packageId,
          page,
          per_page,
        },
      });

      // Extract file data and filename from response
      const { file, fileName } = response.data.message;

      if (!file) {
        throw new Error("No file data received from server");
      }

      // Decode base64 string to binary
      const binaryString = window.atob(file);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create blob with correct MIME type for Excel
      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "users_export.xlsx");
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      return response.data;
    } catch (error) {
      console.error("Export error:", error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: exportUsers,
    onSuccess: () => {
      message.success("Excel file exported successfully!");
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || "Failed to export Excel file"
      );
    },
  });
};
