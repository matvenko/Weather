import React from "react";
import Title from "antd/es/typography/Title";
import { Button, Space, Table, Tooltip, Tag } from "antd";
import { FcCancel } from "react-icons/fc";
import { usePermissions } from "@src/admin/providers/PermissionsProvider/index.js";
import SubscriptionsFilter from "./Filter/SubscriptionsFilter.jsx";
import {AiFillFileExcel} from "react-icons/ai";

const SubscriptionsTable = ({
  subscriptions,
  loading,
  pagination,
  onPageChange,
  onCancel,
  filters,
  onFilterChange,
  onSearch,
  onClearFilters,
  onExport,
  exportLoading,
}) => {
  const { hasPermission } = usePermissions();

  const getStatusInfo = (status) => {
    const statusMap = {
      'A': { text: 'აქტიური', color: 'green' },
      'C': { text: 'გაუქმებული', color: 'red' },
      'I': { text: 'არააქტიური', color: 'gray' },
      'E': { text: 'ვადაგასული', color: 'orange' },
    };
    return statusMap[status] || { text: 'უცნობი', color: 'default' };
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Package ID",
      dataIndex: "packageId",
      key: "packageId",
      width: 120,
      render: (packageId) => {
        const pkgId = packageId ? String(packageId) : "-";
        const color = pkgId === "2" || pkgId.toLowerCase() === "pro" ? "gold" : "blue";
        return <Tag color={color}>{pkgId}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const { text, color } = getStatusInfo(status);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "დაწყების თარიღი",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      render: (date) => {
        if (!date) return "-";
        try {
          return new Date(date).toLocaleString("ka-GE");
        } catch {
          return String(date);
        }
      },
    },
    {
      title: "დასრულების თარიღი",
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
      render: (date) => {
        if (!date) return "-";
        try {
          return new Date(date).toLocaleString("ka-GE");
        } catch {
          return String(date);
        }
      },
    },
    {
      title: "ავტო-განახლება",
      dataIndex: "isAutoRenew",
      key: "isAutoRenew",
      width: 120,
      render: (isAutoRenew) => {
        const autoRenew = isAutoRenew === "Y";
        return (
          <Tag color={autoRenew ? "green" : "default"}>
            {autoRenew ? "კი" : "არა"}
          </Tag>
        );
      },
    },
    {
      title: "განახლების თარიღი",
      dataIndex: "renewsAt",
      key: "renewsAt",
      width: 150,
      render: (date) => {
        if (!date) return "-";
        try {
          return new Date(date).toLocaleString("ka-GE");
        } catch {
          return String(date);
        }
      },
    },
    {
      title: "გაუქმების თარიღი",
      dataIndex: "canceledDate",
      key: "canceledDate",
      width: 150,
      render: (date) => {
        if (!date) return "-";
        try {
          return new Date(date).toLocaleString("ka-GE");
        } catch {
          return String(date);
        }
      },
    },
    {
      title: "Actions",
      key: "action",
      width: 100,
      fixed: 'right',
      render: (_, record) => {
        const canCancel = record.status === "A"; // Only active subscriptions can be cancelled

        return (
          <Space size="small">
            <Tooltip title={canCancel ? "გამოწერის გაუქმება" : "გამოწერა გაუქმებულია"}>
              <span>
                <Button
                  type="text"
                  danger
                  icon={
                    <FcCancel
                      style={{
                        fontSize: '18px',
                        filter: !canCancel ? 'grayscale(100%)' : 'none',
                        opacity: !canCancel ? 0.5 : 1
                      }}
                    />
                  }
                  onClick={() => onCancel(record)}
                  disabled={!canCancel}
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
          Subscriptions
        </Title>

          <Button
              type="primary"
              onClick={onExport}
              loading={exportLoading}
              className="bpg-arial-caps-webfont"
              icon={<AiFillFileExcel />}
          >
              <span>Excel-ში ექსპორტი</span>
          </Button>
      </div>

      <SubscriptionsFilter
        filters={filters}
        onFilterChange={onFilterChange}
        onSearch={onSearch}
        onClearFilters={onClearFilters}
      />

      <Table
        loading={loading}
        columns={tableColumns}
        dataSource={subscriptions}
        rowKey="id"
        rowClassName="tr-spacing"
        bordered
        scroll={{ x: 1500 }}
        pagination={{
          current: pagination?.current || 1,
          pageSize: pagination?.pageSize || 10,
          total: pagination?.total || 0,
          showSizeChanger: true,
          showTotal: (total) => `სულ ${total} გამოწერა`,
          onChange: onPageChange,
        }}
      />
    </>
  );
};

export default SubscriptionsTable;
