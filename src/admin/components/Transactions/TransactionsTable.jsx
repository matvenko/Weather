import React from "react";
import Title from "antd/es/typography/Title";
import { Table, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import TransactionsFilter from "./Filter/TransactionsFilter.jsx";

const TransactionsTable = ({
  transactions,
  loading,
  pagination,
  onPageChange,
  filters,
  onFilterChange,
  onSearch,
  onClearFilters,
}) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "ოპერაციის ტიპი",
      dataIndex: "operationType",
      key: "operationType",
      width: 120,
      render: (type) => (
        <Tag color={type === "D" ? "blue" : type === "C" ? "green" : "default"}>
          {type === "D" ? "დებეტი" : type === "C" ? "კრედიტი" : type}
        </Tag>
      ),
    },
    {
      title: "თანხა",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (amount) => <span>{amount} GEL</span>,
    },
    {
      title: "სტატუსი",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status, record) => (
        <Tooltip title={status !== "წარმატებული" && record.errorMessage}>
          <Tag color={status === "წარმატებული" ? "green" : status === "წარუმატებელი" ? "red" : "orange"}>
            {status}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "კომენტარი",
      dataIndex: "comment",
      key: "comment",
      width: 200,
      ellipsis: true,
    },
    {
      title: "მომხმარებელი",
      dataIndex: "user",
      key: "user",
      width: 200,
      render: (user) => (
        <div>
          <div style={{ fontWeight: 500 }}>{user?.name || "-"}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{user?.email || "-"}</div>
        </div>
      ),
    },
    {
      title: "ინვოისი",
      dataIndex: "invoice",
      key: "invoice",
      width: 150,
      render: (invoice) => (
        <div>
          <div>ID: {invoice?.id || "-"}</div>
          <div style={{ fontSize: 12 }}>
            <Tag color={invoice?.status === "გადახდილი" ? "green" : "orange"} style={{ fontSize: 11 }}>
              {invoice?.status || "-"}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "შემქმნელი",
      dataIndex: "inpUser",
      key: "inpUser",
      width: 150,
      render: (inpUser) => (
        <div>
          <div style={{ fontWeight: 500 }}>{inpUser?.name || "-"}</div>
        </div>
      ),
    },
    {
      title: "თარიღი",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date) => date ? dayjs(date).format("DD.MM.YYYY HH:mm") : "-",
    },
  ];

  return (
    <>
      <div className="two-column-title">
        <Title className="title" level={2}>
          გადარიცხვები
        </Title>
      </div>

      <TransactionsFilter
        filters={filters}
        onFilterChange={onFilterChange}
        onSearch={onSearch}
        onClearFilters={onClearFilters}
      />

      <Table
        loading={loading}
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        rowClassName="tr-spacing"
        bordered
        scroll={{ x: 1400 }}
        pagination={{
          current: pagination?.current || 1,
          pageSize: pagination?.pageSize || 10,
          total: pagination?.total || 0,
          showSizeChanger: true,
          showTotal: (total) => `სულ ${total} ჩანაწერი`,
          onChange: onPageChange,
        }}
      />
    </>
  );
};

export default TransactionsTable;
