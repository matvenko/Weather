import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";
import SidebarContent from "../Sidebar/SidebarContent.jsx";

import "../../css/admin.css";
import { useSelector } from "react-redux";
import { selectCurrentState } from "../../../features/app/appSlice.js";
import ProductsCount from "./ProductsCount/ProductsCount.jsx";
import Title from "antd/es/typography/Title.js";
import Charts from "./charts/charts.jsx";

const DashboardContainer = () => {
  const state = useSelector(selectCurrentState);
  return (
    <>
      <div className={"topAffix"}></div>
      <div className={"admin-app"}>
        <Layout className="admin-container">
          <SidebarContent />
          <Layout
            style={{
              transition: "all 0.2s",
              marginLeft: state.collapsed ? 90 : 250,
            }}
          >
            <Content className={"admin-main-content"}>
              <div className={"two-column-title"}>
                <Title className={"title"} level={2}>
                  DashBoard
                </Title>
              </div>
              <ProductsCount />
              <Charts />
            </Content>
          </Layout>
        </Layout>
      </div>
    </>
  );
};

export default DashboardContainer;
