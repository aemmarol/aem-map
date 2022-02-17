import {Button, Card, Form, Input, Modal, Table} from "antd";
import {FC, useState} from "react";
import {databaseMumeneenFieldData} from "../../interfaces";
import {
  addDataField,
  getMumeneenDataFields,
} from "../../pages/api/v1/user/databaseFields";

interface CardProps {
  data: any[];
  dataColumns: any[];
  cardTitle: string;
  updateData: (data: databaseMumeneenFieldData[]) => any;
  collectionName: string;
  isTableLoading: boolean;
}

export const DashboardDataFieldTableCard: FC<CardProps> = ({
  data,
  dataColumns,
  cardTitle,
  collectionName,
  updateData,
  isTableLoading,
}) => {
  const [form] = Form.useForm();

  const [showAddFieldForm, setshowAddFieldForm] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    setisLoading(true);
    const data: databaseMumeneenFieldData = {
      version: process.env.NEXT_PUBLIC_DATABASE_VERSION,
      name: values.name,
      created_at: new Date(),
    };
    const result = await addDataField(collectionName, data);
    if (result) {
      form.resetFields();
      const newData = await getMumeneenDataFields();
      updateData(newData);
      setshowAddFieldForm(false);
      setisLoading(false);
    } else {
      setisLoading(false);
    }
  };

  return (
    <Card
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
      />
      {showAddFieldForm ? (
        <Modal
          title="Add Mumeneen Data Field"
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
