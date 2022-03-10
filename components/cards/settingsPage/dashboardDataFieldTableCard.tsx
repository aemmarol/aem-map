import {Button, Card, Form, Input, Modal, Table} from "antd";
import {FC, useState} from "react";
import {databaseMumeneenFieldData} from "../../../types";
import {addDataField} from "../../../pages/api/v1/db/databaseFields";
import {defaultDatabaseFields} from "../../../utils";

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
      ...defaultDatabaseFields,
    };

    const result = await addDataField(collectionName, data);
    if (result) {
      form.resetFields();
      setshowAddFieldForm(false);
      setisLoading(false);
      onAddSuccess();
    } else {
      setisLoading(false);
    }
  };

  return (
    <Card
      className="border-radius-10"
      extra={
        <Button onClick={() => setshowAddFieldForm(true)} type="primary">
          Add field
        </Button>
      }
      title={cardTitle}
    >
      <Table
        loading={isTableLoading || isLoading}
        dataSource={data}
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
              rules={[{required: true, message: "Please input field name!"}]}
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
