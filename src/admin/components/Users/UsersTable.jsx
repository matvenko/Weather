import React from "react";
import Title from "antd/es/typography/Title";
import { Button, Space, Table, Tooltip, Tag } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";

const UsersTable = ({
  users,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
      width: 120,
      render: (provider) => (
        <Tag color={provider === "google" ? "blue" : "green"}>
          {provider?.toUpperCase() || "LOCAL"}
        </Tag>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
      render: (role) => <span>{role?.name || "-"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status?.toUpperCase() || "INACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Package",
      dataIndex: "package",
      key: "package",
      width: 120,
      render: (pkg) => <span>{pkg?.name || "-"}</span>,
    },
    {
      title: "Actions",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="რედაქტირება">
            <MdModeEditOutline
              className="action-icon"
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="წაშლა">
            <MdDeleteForever
              className="action-icon"
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tableColumns = columns.map((item) => ({
    ...item,
    ellipsis: false,
  }));

  return (
    <>
      <div className="two-column-title">
        <Title className="title" level={2}>
          Users
        </Title>
      </div>

      <Table
        loading={loading}
        columns={tableColumns}
        dataSource={users}
        rowKey="id"
        rowClassName="tr-spacing"
        bordered
        pagination={{
          current: pagination?.current || 1,
          pageSize: pagination?.pageSize || 10,
          total: pagination?.total || 0,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`,
          onChange: onPageChange,
        }}
      />
    </>
  );
};

export default UsersTable;
