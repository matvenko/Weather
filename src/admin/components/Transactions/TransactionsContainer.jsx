import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Layout, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import SidebarContent from "../Sidebar/SidebarContent.jsx";
import TransactionsTable from "./TransactionsTable.jsx";
import { useTransactions } from "./Hooks/useTransactions.js";
import { selectCurrentState } from "../../../features/app/appSlice.js";
import "../../css/admin.css";

const TransactionsContainer = () => {
  const state = useSelector(selectCurrentState);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [filters, setFilters] = useState({
    email: "",
    operationType: "",
    amount: "",
    fromDate: "",
    toDate: "",
  });

  // Applied filters (used for API call)
  const [appliedFilters, setAppliedFilters] = useState({
    email: "",
    operationType: "",
    amount: "",
    fromDate: "",
    toDate: "",
  });

  // Fetch transactions using custom hook
  const { data, isLoading, error } = useTransactions({
    ...appliedFilters,
    page,
    per_page: pageSize,
  });

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      email: "",
      operationType: "",
      amount: "",
      fromDate: "",
      toDate: "",
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  };

  // Prepare transactions list for table
  const transactionsList = data?.data || [];
  const total = data?.recordsNumber || 0;

  return (
    <>
      {isLoading && !transactionsList.length ? (
        <div className="fullSpinner">
          <Spin size="large" spinning={true} className="spinnn" />
        </div>
      ) : (
        <>
          <div className="topAffix"></div>
          <div className="admin-app">
            <Layout className="admin-container">
              <SidebarContent />
              <Layout
                style={{
                  transition: "all 0.2s",
                  marginLeft: state.collapsed ? 90 : 250,
                }}
              >
                <Content className="admin-main-content">
                  {error ? (
                    <div style={{ padding: "20px", color: "red" }}>
                      შეცდომა ტრანზაქციების ჩატვირთვისას: {error.message}
                    </div>
                  ) : (
                    <TransactionsTable
                      transactions={transactionsList}
                      loading={isLoading}
                      pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                      }}
                      onPageChange={handlePageChange}
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onSearch={handleSearch}
                      onClearFilters={handleClearFilters}
                    />
                  )}
                </Content>
              </Layout>
            </Layout>
          </div>
        </>
      )}
    </>
  );
};

export default TransactionsContainer;
