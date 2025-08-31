import React from "react";
import Title from "antd/es/typography/Title";
import { Button, Space, Table, Tooltip, Modal } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";

const BrandsTable = ({
  responseBrandsList,
  showDrawer,
  setEditingBrand,
  onDeleteBrand,
  onEditBrand,
}) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 0,
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Actions",
      key: "action",
      width: 100,
      render: (record) => {
        const onEditRecord = async () => {
          setEditingBrand({ ...record });
          showDrawer();
        };

        const onDeleteCompanyModal = async () => {
          Modal.confirm({
            title: "ნამდვილად გსურთ წაშლა?",
            okText: "კი",
            okType: "danger",
            onOk: () => {
              onDeleteBrand(record.id).then();
            },
          });
        };

        const onEditProjectMiddleware = () => {
          onEditBrand(record);
        };

        return (
          <Space size={"middle"}>
            <Tooltip
              title={"რედაქტირება"}
              onClick={() => onEditProjectMiddleware()}
            >
              <MdModeEditOutline className={"action-icon"} />
            </Tooltip>
            <Tooltip title={"წაშლა"}>
              <MdDeleteForever
                className={"action-icon"}
                onClick={() => onDeleteCompanyModal()}
              />
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
      <div className={"two-column-title"}>
        <Title className={"title"} level={2}>
          Brands
        </Title>

        <Button
          type="primary"
          onClick={showDrawer}
          className={"bpg-arial-caps-webfont"}
        >
          <AiOutlinePlus className={"ml-5"} />
          <span>{"ბრენდის დამატება"}</span>
        </Button>
      </div>

      <Table
        pagination={false}
        columns={tableColumns}
        dataSource={responseBrandsList}
        rowClassName="tr-spacing"
        bordered
      />
    </>
  );
};

export default BrandsTable;
