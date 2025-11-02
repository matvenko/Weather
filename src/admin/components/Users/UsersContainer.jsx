import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Layout, Spin, Modal } from "antd";
import { Content } from "antd/es/layout/layout";
import SidebarContent from "../Sidebar/SidebarContent.jsx";
import UsersTable from "./UsersTable.jsx";
import { useUsers } from "./Hooks/useUsers.js";
import { selectCurrentState } from "../../../features/app/appSlice.js";
import "../../css/admin.css";

const UsersContainer = () => {
  const [modal, contextHolder] = Modal.useModal();
  const state = useSelector(selectCurrentState);

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    email: "",
    provider: "",
    roleId: "",
    status: "",
    packageId: "",
  });

  // Fetch users using custom hook
  const { data, isLoading, error } = useUsers({
    ...filters,
    page,
    per_page: pageSize,
  });

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleEdit = (record) => {
    Modal.info({
      title: "Edit User",
      content: `Editing user: ${record.email}`,
      okText: "OK",
    });
    // TODO: Implement edit functionality
    console.log("Edit user:", record);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "ნამდვილად გსურთ წაშლა?",
      content: `User: ${record.email}`,
      okText: "კი",
      cancelText: "გაუქმება",
      okType: "danger",
      onOk: async () => {
        // TODO: Implement delete functionality
        console.log("Delete user:", record);
        Modal.success({
          content: "User deleted successfully!",
        });
      },
    });
  };

  // Prepare users list for table
  const usersList = data?.users || data?.data || [];
  const total = data?.total || data?.pagination?.total || 0;

  return (
    <>
      {contextHolder}
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
                      onEdit={handleEdit}
                      onDelete={handleDelete}
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
