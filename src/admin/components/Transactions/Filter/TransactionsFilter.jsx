import React from "react";
import { Input, Select, DatePicker, Button, Space, Row, Col, Card } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const TransactionsFilter = ({
  filters,
  onFilterChange,
  onSearch,
  onClearFilters,
}) => {
  const inputStyle = { height: 40 };

  return (
    <Card style={{ marginBottom: 16, overflow: "visible" }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6} lg={5}>
          <Input
            placeholder="Email"
            value={filters.email}
            onChange={(e) => onFilterChange("email", e.target.value)}
            allowClear
            style={inputStyle}
          />
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Select
            placeholder="ოპერაციის ტიპი"
            value={filters.operationType || undefined}
            onChange={(value) => onFilterChange("operationType", value || "")}
            allowClear
            style={{ width: "100%", height: 40 }}
          >
            <Select.Option value="D">დებეტი (D)</Select.Option>
            <Select.Option value="C">კრედიტი (C)</Select.Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Input
            placeholder="თანხა"
            value={filters.amount}
            onChange={(e) => onFilterChange("amount", e.target.value)}
            allowClear
            type="number"
            style={inputStyle}
          />
        </Col>
        <Col xs={24} sm={12} md={6} lg={3}>
          <DatePicker
            placeholder="დაწყება"
            value={filters.fromDate ? dayjs(filters.fromDate) : null}
            onChange={(date) => onFilterChange("fromDate", date ? date.format("YYYY-MM-DD") : "")}
            style={{ width: "100%", height: 40 }}
            format="DD.MM.YYYY"
            getPopupContainer={(trigger) => trigger.parentElement}
          />
        </Col>
        <Col xs={24} sm={12} md={6} lg={3}>
          <DatePicker
            placeholder="დასრულება"
            value={filters.toDate ? dayjs(filters.toDate) : null}
            onChange={(date) => onFilterChange("toDate", date ? date.format("YYYY-MM-DD") : "")}
            style={{ width: "100%", height: 40 }}
            format="DD.MM.YYYY"
            getPopupContainer={(trigger) => trigger.parentElement}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={5}>
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={onSearch}
              style={inputStyle}
            >
              ძებნა
            </Button>
            <Button
              icon={<ClearOutlined />}
              onClick={onClearFilters}
              style={inputStyle}
            >
              გასუფთავება
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default TransactionsFilter;
