import { useMutation } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";
import { message } from "antd";

/**
 * Custom hook to export transactions to Excel
 * @param {Object} params - Query parameters
 * @param {string} params.email - Filter by email
 * @param {string} params.operationType - Filter by operation type
 * @param {string} params.amount - Filter by amount
 * @param {string} params.fromDate - Filter from date
 * @param {string} params.toDate - Filter to date
 * @param {number} params.page - Current page number
 * @param {number} params.per_page - Items per page
 */
export const useExportTransactions = () => {
  const exportTransactions = async (params) => {
    const {
      email = "",
      operationType = "",
      amount = "",
      fromDate = "",
      toDate = "",
      page = 1,
      per_page = 10,
    } = params;

    try {
      const response = await privateAxios.get("/api/v1/transactions/export-transactions", {
        params: {
          email,
          operationType,
          amount,
          fromDate,
          toDate,
          page,
          per_page,
        },
      });

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
      link.setAttribute("download", fileName || "transactions_export.xlsx");
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
    mutationFn: exportTransactions,
    onSuccess: () => {
      message.success("Excel ფაილი წარმატებით ჩამოიტვირთა!");
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || "Excel ფაილის ექსპორტი ვერ მოხერხდა"
      );
    },
  });
};
