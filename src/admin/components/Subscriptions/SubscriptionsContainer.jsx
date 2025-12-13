import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Layout, Spin, Modal } from "antd";
import { Content } from "antd/es/layout/layout";
import { useQueryClient } from "@tanstack/react-query";
import { useGlobalProvider } from "@src/providers/public/GlobalProvider/index.js";
import SidebarContent from "../Sidebar/SidebarContent.jsx";
import SubscriptionsTable from "./SubscriptionsTable.jsx";
import { useSubscriptions } from "./Hooks/useSubscriptions.js";
import { useCancelSubscription } from "./Hooks/useCancelSubscription.js";
import { selectCurrentState } from "../../../features/app/appSlice.js";
import "../../css/admin.css";

const SubscriptionsContainer = () => {
  const state = useSelector(selectCurrentState);
  const queryClient = useQueryClient();
  const { notificationApi } = useGlobalProvider();

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [filters, setFilters] = useState({
    id: "",
    masterId: "",
    email: "",
    packageId: "",
    periodStart: "",
    periodEnd: "",
    status: "",
  });

  // Applied filters (used for API call)
  const [appliedFilters, setAppliedFilters] = useState({
    id: "",
    masterId: "",
    email: "",
    packageId: "",
    periodStart: "",
    periodEnd: "",
    status: "",
  });

  // Fetch subscriptions using custom hook
  const { data, isLoading, error } = useSubscriptions({
    ...appliedFilters,
    page,
    per_page: pageSize,
  });

  // Cancel subscription mutation
  const { mutate: cancelSubscription, isPending: isCanceling } = useCancelSubscription();

  // Modal state
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

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
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      id: "",
      masterId: "",
      email: "",
      packageId: "",
      periodStart: "",
      periodEnd: "",
      status: "",
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  };

  const handleCancel = (record) => {
    setSelectedSubscription(record);
    setCancelModalVisible(true);
  };

  const handleCancelConfirm = () => {
    if (selectedSubscription) {
      cancelSubscription(selectedSubscription.id, {
        onSuccess: () => {
          notificationApi?.success({
            message: "გამოწერა წარმატებით გაუქმდა!",
            duration: 3,
          });
          // Refetch subscriptions list to get updated data
          queryClient.invalidateQueries(["subscriptions"]);
          setCancelModalVisible(false);
          setSelectedSubscription(null);
        },
        onError: (error) => {
          notificationApi?.error({
            message: "გამოწერის გაუქმება ვერ მოხერხდა",
            description: error?.response?.data?.message || "გამოწერის გაუქმება ვერ მოხერხდა. გთხოვთ სცადოთ მოგვიანებით.",
          });
        },
      });
    }
  };

  const handleCancelModalCancel = () => {
    setCancelModalVisible(false);
    setSelectedSubscription(null);
  };

  // Prepare subscriptions list for table
  const subscriptionsList = data?.subscriptions || data?.data || [];
  const total = data?.recordsNumber || 0;

  return (
    <>
      {/* Cancel Subscription Modal */}
      <Modal
        title="გამოწერის გაუქმება"
        open={cancelModalVisible}
        onOk={handleCancelConfirm}
        onCancel={handleCancelModalCancel}
        okText="გაუქმება"
        cancelText="დახურვა"
        okType="danger"
        confirmLoading={isCanceling}
      >
        {selectedSubscription && (
          <div>
            <p>
              ნამდვილად გსურთ გამოწერის გაუქმება?
            </p>
            <p>
              <strong>Email:</strong> {selectedSubscription.email}
            </p>
            <p>
              <strong>პაკეტი:</strong> {selectedSubscription.packageId}
            </p>
            <p>
              <strong>დაწყების თარიღი:</strong> {selectedSubscription.startDate}
            </p>
            <p>
              <strong>დასრულების თარიღი:</strong> {selectedSubscription.endDate}
            </p>
          </div>
        )}
      </Modal>

      {isLoading && !subscriptionsList.length ? (
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
                      Error loading subscriptions: {error.message}
                    </div>
                  ) : (
                    <SubscriptionsTable
                      subscriptions={subscriptionsList}
                      loading={isLoading}
                      pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                      }}
                      onPageChange={handlePageChange}
                      onCancel={handleCancel}
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

export default SubscriptionsContainer;
