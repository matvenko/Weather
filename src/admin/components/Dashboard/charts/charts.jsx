import React from "react";
import { Card, Col, Row } from "antd";
import LineChart from "../LineChart/LineChart.jsx";
import EChart from "../EChart/EChart.jsx";

const Charts = () => {
  return (
    <Row gutter={[24, 0]}>
      <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <EChart />
        </Card>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <LineChart />
        </Card>
      </Col>
    </Row>
  );
};

export default Charts;
