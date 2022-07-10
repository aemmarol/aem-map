import {Button, Card, Form, Input, message, Modal, Space, Table} from "antd";
import {FC, useState} from "react";
import {databaseMumeneenFieldData} from "../../../types";
import {defaultDatabaseFields, getauthToken} from "../../../utils";
import memberFields from "../../../sample_data/mumeneenDataField.json";
import fileFields from "../../../sample_data/fileField.json";

import {API} from "../../../utils/api";
import {handleResponse} from "../../../utils/handleResponse";
import {
  fileDetailsFieldCollectionName,
  mumeneenDetailsFieldCollectionName,
} from "../../../mongodb/dbCollectionNames";

interface CardProps {
  data: any[];
  dataColumns: any[];
  cardTitle: string;
  modalTitle: string;
  collectionName: string;
  isTableLoading: boolean;
  onAddSuccess: () => any;
}

export const DashboardDataFieldTableCard: FC<CardProps> = ({
  data,
  dataColumns,
  cardTitle,
  collectionName,
  isTableLoading,
  modalTitle,
  onAddSuccess,
}) => {
  const [form] = Form.useForm();

  const [showAddFieldForm, setshowAddFieldForm] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    setisLoading(true);
    const data: databaseMumeneenFieldData = {
      name: values.name,
      label: values.label,
      ...defaultDatabaseFields,
    };

    await fetch(API.dbFields + "?collectionName=" + collectionName, {
      method: "POST",
      headers: {...getauthToken()},
      body: JSON.stringify(data),
    })
      .then(handleResponse)
      .then(() => {
        form.resetFields();
        setshowAddFieldForm(false);
        setisLoading(false);
        onAddSuccess();
      })
      .catch((error) => {
        message.error(error);
        setisLoading(false);
      });
  };

  const handleResetFields = async () => {
    setisLoading(true);

    if (data && data.length > 0) {
      await Promise.all(
        data.map(async (val: any) => {
          await fetch(API.dbFields + "?collectionName=" + collectionName, {
            method: "DELETE",
            headers: {...getauthToken()},
            body: JSON.stringify({id: val._id}),
          }).then(handleResponse);
        })
      ).catch((error) => {
        setisLoading(false);
        message.error(error);
      });
    }

    const dataArr =
      collectionName === mumeneenDetailsFieldCollectionName
        ? memberFields
        : collectionName === fileDetailsFieldCollectionName
        ? fileFields
        : [];

    await Promise.all(
      dataArr.map(async (value) => {
        await fetch(API.dbFields + "?collectionName=" + collectionName, {
          method: "POST",
          headers: {...getauthToken()},
          body: JSON.stringify({
            ...value,
            ...defaultDatabaseFields,
          }),
        }).then(handleResponse);
      })
    )
      .then(() => {
        setisLoading(false);
        onAddSuccess();
      })
      .catch((error) => {
        setisLoading(false);
        message.error(error);
      });
  };

  return (
    <Card
      className="border-radius-10"
      extra={
        <Space>
          <Button onClick={() => setshowAddFieldForm(true)} type="primary">
            Add field
          </Button>
          <Button onClick={handleResetFields}>Reset Fields </Button>
        </Space>
      }
      title={cardTitle}
    >
      <Table
        loading={isTableLoading || isLoading}
        dataSource={data.map((val) => ({...val, key: val.name}))}
        columns={dataColumns}
        scroll={{y: "400px"}}
        pagination={false}
      />
      {showAddFieldForm ? (
        <Modal
          title={modalTitle}
          visible={showAddFieldForm}
          onCancel={() => setshowAddFieldForm(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            name="add-data-field"
            onFinish={handleFormSubmit}
          >
            <Form.Item
              label="Field Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input field name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Field Label"
              name="label"
              rules={[
                {
                  required: true,
                  message: "Please input field label!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </Card>
  );
};
