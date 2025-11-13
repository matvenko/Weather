import React from "react";
import Title from "antd/es/typography/Title";
import { Button, Space, Table, Tooltip, Tag } from "antd";
import { FcCancel, FcApproval, FcManager } from "react-icons/fc";
import {AiFillFileExcel} from "react-icons/ai";
import { usePermissions } from "@src/admin/providers/PermissionsProvider/index.js";

const UsersTable = ({
  users,
  loading,
  pagination,
  onPageChange,
  onExport,
  exportLoading,
  onBlock,
  onActivate,
  onChangeRole,
}) => {
  const { hasPermission } = usePermissions();

  // Check if user has export permission
  const canExport = hasPermission("users", "exportUsers");
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
      width: 150,
      render: (_, record) => {
        const actions = record.actions || [];
        const hasCloseAction = actions.includes("close");
        const hasRecoverAction = actions.includes("recover");
        const hasChangeRoleAction = actions.includes("changeRole");

        return (
          <Space size="small">
            <Tooltip title={hasCloseAction ? "დაბლოკვა" : "მოქმედება მიუწვდომელია"}>
              <span>
                <Button
                  type="text"
                  icon={
                    <FcCancel
                      style={{
                        fontSize: '18px',
                        filter: !hasCloseAction ? 'grayscale(100%)' : 'none',
                        opacity: !hasCloseAction ? 0.5 : 1
                      }}
                    />
                  }
                  onClick={() => onBlock(record)}
                  disabled={!hasCloseAction}
                  style={{ padding: '4px 8px' }}
                />
              </span>
            </Tooltip>

            <Tooltip title={hasRecoverAction ? "გააქტიურება" : "მოქმედება მიუწვდომელია"}>
              <span>
                <Button
                  type="text"
                  icon={
                    <FcApproval
                      style={{
                        fontSize: '18px',
                        filter: !hasRecoverAction ? 'grayscale(100%)' : 'none',
                        opacity: !hasRecoverAction ? 0.5 : 1
                      }}
                    />
                  }
                  onClick={() => onActivate(record)}
                  disabled={!hasRecoverAction}
                  style={{ padding: '4px 8px' }}
                />
              </span>
            </Tooltip>

            <Tooltip title={hasChangeRoleAction ? "როლის შეცვლა" : "მოქმედება მიუწვდომელია"}>
              <span>
                <Button
                  type="text"
                  icon={
                    <FcManager
                      style={{
                        fontSize: '18px',
                        filter: !hasChangeRoleAction ? 'grayscale(100%)' : 'none',
                        opacity: !hasChangeRoleAction ? 0.5 : 1
                      }}
                    />
                  }
                  onClick={() => onChangeRole(record)}
                  disabled={!hasChangeRoleAction}
                  style={{ padding: '4px 8px' }}
                />
              </span>
            </Tooltip>
          </Space>
        );
      },
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

        {canExport && (
          <Button
            type="primary"
            onClick={onExport}
            loading={exportLoading}
            className="bpg-arial-caps-webfont"
            icon={<AiFillFileExcel />}
          >
            <span>Excel-ში ექსპორტი</span>
          </Button>
        )}
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
