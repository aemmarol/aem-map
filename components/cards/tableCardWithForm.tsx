import {Button, Card, Form, Modal} from "antd";
import {FC, useState} from "react";

interface CardProps {
  cardTitle: string;
  modalTitle: string;
  addBtnText: string;
  onFormSubmit: (data: any, callback: () => any) => any;
  TableComponent: any;
  tableComponentProps: any;
  formFields: any;
}

export const TableCardWithForm: FC<CardProps> = ({
  cardTitle,
  modalTitle,
  addBtnText,
  onFormSubmit,
  tableComponentProps,
  TableComponent,
  formFields,
}) => {
  const [addForm] = Form.useForm();

  const [showAddFieldForm, setshowAddFieldForm] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    setisLoading(true);

    const callback = () => {
      addForm.resetFields();
      setshowAddFieldForm(false);
    };

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
      <TableComponent {...tableComponentProps} isLoading={isLoading} />
      {showAddFieldForm ? (
        <Modal
          title={modalTitle}
          visible={showAddFieldForm}
          onCancel={() => setshowAddFieldForm(false)}
          footer={null}
          className="max-height-500 overflow-y-auto"
        >
          <Form
            form={addForm}
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
