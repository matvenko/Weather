import { Button, Col, Drawer, Form, Input, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

export const BrandsDrawer = ({
  openDrawer,
  editingBrand,
  isEditing,
  addOrEditSubmit,
  onClose,
  contextHolder,
}) => {
  return (
    <>
      <Drawer
        key={editingBrand?.id || "create"}
        title={isEditing ? "რედაქტირება" : "დამატება"}
        width={480}
        onClose={onClose}
        open={openDrawer}
        autoFocus={true}
      >
        <Form layout="vertical" hideRequiredMark onFinish={addOrEditSubmit}>
          {isEditing && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="id"
                  initialValue={editingBrand.id}
                  labelAlign="left"
                >
                  <Input disabled={true} className={"greyInput"} />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
            </Row>
          )}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                initialValue={isEditing ? editingBrand.name : ""}
                rules={[
                  {
                    required: true,
                    message: "სახელის შეყვანა აუცილებელია",
                  },
                ]}
                labelAlign="left"
              >
                <Input
                  className={"greyInput"}
                  placeholder={"ბანერის დასახელება"}
                />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
          <Row className={"drawer-submit-area"}>
            <Col span={24}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="drawer-login-form-button"
                >
                  {isEditing ? "შეცვლა" : "დამატება"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      {contextHolder}
    </>
  );
};
