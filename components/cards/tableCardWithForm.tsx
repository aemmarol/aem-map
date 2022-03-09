import {Button, Card, Form, Modal, Table} from "antd";
import {FC, useState} from "react";

interface CardProps {
  cardTitle: string;
  onFormSubmit: (values: object, callback: Function) => any;
  isTableLoading: boolean;
  addBtnText: string;
  formFields: any;
  tableComponent: any;
  modalTitle: string;
}

export const TableCardWithForm: FC<CardProps> = ({
  cardTitle,
  onFormSubmit,
  isTableLoading,
  addBtnText,
  formFields,
  tableComponent,
  modalTitle,
}) => {
  const [form] = Form.useForm();

  const [showAddFieldForm, setshowAddFieldForm] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    setisLoading(true);

    const callback = () => setshowAddFieldForm(false);

    await onFormSubmit(values, callback);
  };

  return (
    <Card
      className="border-radius-10"
      extra={
        <Button onClick={() => setshowAddFieldForm(true)} type="primary">
          {addBtnText}
        </Button>
      }
      title={cardTitle}
    >
      {tableComponent}
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
            {formFields}
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
