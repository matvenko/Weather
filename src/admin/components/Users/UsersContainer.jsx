import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Layout, Spin, Modal, Radio, Space } from "antd";
import { Content } from "antd/es/layout/layout";
import { useQueryClient } from "@tanstack/react-query";
import { useGlobalProvider } from "@src/providers/public/GlobalProvider/index.js";
import SidebarContent from "../Sidebar/SidebarContent.jsx";
import UsersTable from "./UsersTable.jsx";
import { useUsers } from "./Hooks/useUsers.js";
import { useExportUsers } from "./Hooks/useExportUsers.js";
import { useBlockUser } from "./Hooks/useBlockUser.js";
import { useActivateUser } from "./Hooks/useActivateUser.js";
import { useChangeRole } from "./Hooks/useChangeRole.js";
import { useRoles } from "./Hooks/useRoles.js";
import { selectCurrentState } from "../../../features/app/appSlice.js";
import "../../css/admin.css";

const UsersContainer = () => {
  const state = useSelector(selectCurrentState);
  const queryClient = useQueryClient();
  const { notificationApi } = useGlobalProvider();

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [filters, setFilters] = useState({
    email: "",
    provider: "",
    roleId: "",
    status: "",
    packageId: "",
  });

  // Applied filters (used for API call)
  const [appliedFilters, setAppliedFilters] = useState({
    email: "",
    provider: "",
    roleId: "",
    status: "",
    packageId: "",
  });

  // Fetch users using custom hook
  const { data, isLoading, error } = useUsers({
    ...appliedFilters,
    page,
    per_page: pageSize,
  });

  // Fetch roles
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles();

  // Export users mutation
  const { mutate: exportUsers, isPending: isExporting } = useExportUsers();

  // Block user mutation
  const { mutate: blockUser, isPending: isBlocking } = useBlockUser();

  // Activate user mutation
  const { mutate: activateUser, isPending: isActivating } = useActivateUser();

  // Change role mutation
  const { mutate: changeRole, isPending: isChangingRole } = useChangeRole();

  // Modal states
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [activateModalVisible, setActivateModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

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
      email: "",
      provider: "",
      roleId: "",
      status: "",
      packageId: "",
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  };

  const handleExport = () => {
    exportUsers({
      ...appliedFilters,
      page,
      per_page: pageSize,
    });
  };

  const handleBlock = (record) => {
    setSelectedUser(record);
    setBlockModalVisible(true);
  };

  const handleBlockConfirm = () => {
    if (selectedUser) {
      blockUser(selectedUser.id, {
        onSuccess: () => {
          notificationApi?.success({
            message: "მომხმარებელი წარმატებით დაიბლოკა!",
            duration: 3,
          });
          // Refetch users list to get updated data
          queryClient.invalidateQueries(["users"]);
          setBlockModalVisible(false);
          setSelectedUser(null);
        },
        onError: (error) => {
          notificationApi?.error({
            message: "დაბლოკვა ვერ მოხერხდა",
            description: error?.response?.data?.message || "მომხმარებლის დაბლოკვა ვერ მოხერხდა",
          });
        },
      });
    }
  };

  const handleBlockCancel = () => {
    setBlockModalVisible(false);
    setSelectedUser(null);
  };

  const handleActivate = (record) => {
    setSelectedUser(record);
    setActivateModalVisible(true);
  };

  const handleActivateConfirm = () => {
    if (selectedUser) {
      activateUser(selectedUser.id, {
        onSuccess: () => {
          notificationApi?.success({
            message: "მომხმარებელი წარმატებით გააქტიურდა!",
            duration: 3,
          });
          // Refetch users list to get updated data
          queryClient.invalidateQueries(["users"]);
          setActivateModalVisible(false);
          setSelectedUser(null);
        },
        onError: (error) => {
          notificationApi?.error({
            message: "გააქტიურება ვერ მოხერხდა",
            description: error?.response?.data?.message || "მომხმარებლის გააქტიურება ვერ მოხერხდა",
          });
        },
      });
    }
  };

  const handleActivateCancel = () => {
    setActivateModalVisible(false);
    setSelectedUser(null);
  };

  const handleChangeRole = (record) => {
    setSelectedUser(record);
    setSelectedRole(record.role?.id || 2); // Default to User role if not set
    setRoleModalVisible(true);
  };

  const handleRoleModalOk = () => {
    if (selectedUser && selectedRole) {
      changeRole(
        { userId: selectedUser.id, roleId: selectedRole },
        {
          onSuccess: () => {
            notificationApi?.success({
              message: "როლი წარმატებით შეიცვალა!",
              duration: 3,
            });
            // Refetch users list to get updated data
            queryClient.invalidateQueries(["users"]);
            setRoleModalVisible(false);
            setSelectedUser(null);
            setSelectedRole(null);
          },
          onError: (error) => {
            notificationApi?.error({
              message: "როლის შეცვლა ვერ მოხერხდა",
              description: error?.response?.data?.message || "როლის შეცვლა ვერ მოხერხდა",
            });
          },
        }
      );
    }
  };

  const handleRoleModalCancel = () => {
    setRoleModalVisible(false);
    setSelectedUser(null);
    setSelectedRole(null);
  };

  // Prepare users list for table
  const usersList = data?.users || data?.data || [];
  const total = data?.total || data?.pagination?.total || 0;

  return (
    <>
      {/* Block User Modal */}
      <Modal
        title="მომხმარებლის დაბლოკვა"
        open={blockModalVisible}
        onOk={handleBlockConfirm}
        onCancel={handleBlockCancel}
        okText="დაბლოკვა"
        cancelText="გაუქმება"
        okType="danger"
        confirmLoading={isBlocking}
      >
        {selectedUser && (
          <p>
            ნამდვილად გსურთ მომხმარებლის დაბლოკვა: <strong>{selectedUser.email}</strong>?
          </p>
        )}
      </Modal>

      {/* Activate User Modal */}
      <Modal
        title="მომხმარებლის გააქტიურება"
        open={activateModalVisible}
        onOk={handleActivateConfirm}
        onCancel={handleActivateCancel}
        okText="გააქტიურება"
        cancelText="გაუქმება"
        confirmLoading={isActivating}
      >
        {selectedUser && (
          <p>
            გსურთ მომხმარებლის გააქტიურება: <strong>{selectedUser.email}</strong>?
          </p>
        )}
      </Modal>

      {/* Role Change Modal */}
      <Modal
        title="როლის შეცვლა"
        open={roleModalVisible}
        onOk={handleRoleModalOk}
        onCancel={handleRoleModalCancel}
        okText="შენახვა"
        cancelText="გაუქმება"
        confirmLoading={isChangingRole}
      >
        {selectedUser && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <p>
              <strong>მომხმარებელი:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>აირჩიეთ როლი:</strong>
            </p>
            <Radio.Group
              onChange={(e) => setSelectedRole(e.target.value)}
              value={selectedRole}
              disabled={isLoadingRoles}
            >
              <Space direction="vertical">
                {rolesData?.map((role) => (
                  <Radio key={role.id} value={role.id}>
                    {role.dictionaryKey}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Space>
        )}
      </Modal>

      {isLoading && !usersList.length ? (
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
                      Error loading users: {error.message}
                    </div>
                  ) : (
                    <UsersTable
                      users={usersList}
                      loading={isLoading}
                      pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                      }}
                      onPageChange={handlePageChange}
                      onBlock={handleBlock}
                      onActivate={handleActivate}
                      onChangeRole={handleChangeRole}
                      onExport={handleExport}
                      exportLoading={isExporting}
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onSearch={handleSearch}
                      onClearFilters={handleClearFilters}
                      roles={rolesData}
                      rolesLoading={isLoadingRoles}
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

export default UsersContainer;
