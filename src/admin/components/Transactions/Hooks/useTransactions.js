import { useQuery } from "@tanstack/react-query";
import privateAxios from "@src/api/privateAxios.jsx";

/**
 * Custom hook to fetch transactions from the API
 * @param {Object} params - Query parameters
 * @param {string} params.email - Filter by email
 * @param {string} params.operationType - Filter by operation type (D, C, etc.)
 * @param {string} params.amount - Filter by amount
 * @param {string} params.fromDate - Filter from date
 * @param {string} params.toDate - Filter to date
 * @param {number} params.page - Current page number
 * @param {number} params.per_page - Items per page
 */
export const useTransactions = (params = {}) => {
  const {
    email = "",
    operationType = "",
    amount = "",
    fromDate = "",
    toDate = "",
    page = 1,
    per_page = 10,
  } = params;

  const fetchTransactions = async () => {
    const response = await privateAxios.get("/api/v1/transactions/get-transactions", {
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
    return response.data;
  };

  return useQuery({
    queryKey: ["transactions", email, operationType, amount, fromDate, toDate, page, per_page],
    queryFn: fetchTransactions,
    keepPreviousData: true,
  });
};
