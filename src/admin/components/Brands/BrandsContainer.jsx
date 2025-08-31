import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Spin, Modal } from "antd";
import { Content } from "antd/es/layout/layout";
import SidebarContent from "../Sidebar/SidebarContent.jsx";
import {
  useAddBrandMutation,
  useChangeBrandMutation,
  useDeleteBrandMutation,
  useGetBrandsQuery,
} from "../../../features/brands/brandsApi.js";
import "../../css/admin.css";

import { selectCurrentState } from "../../../features/app/appSlice.js";
import BrandsTable from "./BrandsTable.jsx";
import { setBrandsData } from "../../../features/brands/brandsState.js";
import { BrandsDrawer } from "./Drawer/BrandsDrawer";
import {
  generalAddOrEditHandler,
  generalDeleteHandler,
} from "../../shared/Common.js";

const BrandsContainer = () => {
  const [modal, contextHolder] = Modal.useModal();
  const state = useSelector(selectCurrentState);

  const { responseBrands } = useGetBrandsQuery(
    {},
    {
      selectFromResult: ({ data }) => ({
        responseBrands: data?.responseBrands,
      }),
    },
  );

  const [deleteBrand] = useDeleteBrandMutation();
  const [addBrand] = useAddBrandMutation();
  const [changeBrand] = useChangeBrandMutation();

  const [isEditing, setEditing] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const dispatch = useDispatch();

  const setBrandsStateAc = () => {
    dispatch(setBrandsData({ responseBrands }));
  };

  useEffect(() => {
    setBrandsStateAc();
  }, [responseBrands]);

  const responseBrandsList = [];
  responseBrands?.map((item) => {
    responseBrandsList.push({
      ...item,
      key: item.id,
    });
  });

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
    setEditingBrand(false);
    setEditing(false);
  };

  const onDeleteBrand = async (recordId) => {
    await generalDeleteHandler(deleteBrand, { id: recordId }, null);
  };

  const addOrEditSubmit = async (values) => {
    const postQuery = {
      name: values.name,
    };
    if (isEditing) {
      postQuery.id = editingBrand.id;
    }
    const brandAction = isEditing ? changeBrand : addBrand;
    await generalAddOrEditHandler(brandAction, postQuery, setLoading, onClose);
  };

  const onEditBrand = (record) => {
    setEditing(true);
    setEditingBrand({ ...record });
    showDrawer();
  };

  return (
    <>
      {!responseBrands || loading ? (
        <div className={"fullSpinner"}>
          <Spin size="large" spinning={true} className={"spinnn"} />
        </div>
      ) : (
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
                  <BrandsTable
                    onEditBrand={onEditBrand}
                    setEditingBrand={setEditingBrand}
                    responseBrandsList={responseBrandsList}
                    onDeleteBrand={onDeleteBrand}
                    showDrawer={showDrawer}
                    setLoading={setLoading}
                  />
                  <BrandsDrawer
                    isEditing={isEditing}
                    editingBrand={editingBrand}
                    openDrawer={openDrawer}
                    onClose={onClose}
                    addOrEditSubmit={addOrEditSubmit}
                    contextHolder={contextHolder}
                  />
                </Content>
              </Layout>
            </Layout>
          </div>
        </>
      )}
    </>
  );
};

export default BrandsContainer;
