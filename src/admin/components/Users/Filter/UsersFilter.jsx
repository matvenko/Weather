import React from "react";
import { Input, Select, Button, Space, Row, Col, Card } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";

const UsersFilter = ({
  filters,
  onFilterChange,
  onSearch,
  onClearFilters,
  roles = [],
  rolesLoading = false,
}) => {
  const inputStyle = { height: 40 };

  return (
    <Card style={{ marginBottom: 16 }}>
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
            placeholder="Provider"
            value={filters.provider || undefined}
            onChange={(value) => onFilterChange("provider", value || "")}
            allowClear
            style={{ width: "100%", height: 40 }}
          >
            <Select.Option value="local">Local</Select.Option>
            <Select.Option value="google">Google</Select.Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Select
            placeholder="როლი"
            value={filters.roleId || undefined}
            onChange={(value) => onFilterChange("roleId", value || "")}
            allowClear
            loading={rolesLoading}
            style={{ width: "100%", height: 40 }}
          >
            {roles?.map((role) => (
              <Select.Option key={role.id} value={role.id}>
                {role.dictionaryKey || role.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Select
            placeholder="სტატუსი"
            value={filters.status || undefined}
            onChange={(value) => onFilterChange("status", value || "")}
            allowClear
            style={{ width: "100%", height: 40 }}
          >
            <Select.Option value="active">აქტიური</Select.Option>
            <Select.Option value="inactive">არააქტიური</Select.Option>
          </Select>
        </Col>
        <Col xs={24} sm={24} md={24} lg={7}>
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

export default UsersFilter;
