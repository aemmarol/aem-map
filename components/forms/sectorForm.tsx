import {Form, Input} from "antd";
import {FC} from "react";

export const SectorFormFields: FC = () => {
  return (
    <>
      <Form.Item
        label="Mohallah Name"
        name="name"
        rules={[{required: true, message: "Please input field name!"}]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Primary Color"
        name="primary_color"
        rules={[{required: true, message: "Please input Primary Color!"}]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Secondary Color"
        name="secondary_color"
        rules={[{required: true, message: "Please input Secondary Color!"}]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Masool Name"
        name="masool_name"
        rules={[{required: true, message: "Please input Masool Name!"}]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Masool ITS Number"
        name="masool_its"
        rules={[{required: true, message: "Please input ITS Number!"}]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Masool Contact Number"
        name="masool_contact_number"
        rules={[{required: true, message: "Please input Contact Number!"}]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Masoola Name"
        name="masoola_name"
        rules={[{required: true, message: "Please input Masoola Name!"}]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Masoola ITS Number"
        name="masoolaa_its"
        rules={[{required: true, message: "Please input ITS Number!"}]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Masoola Contact Number"
        name="masoola_contact_number"
        rules={[{required: true, message: "Please input Contact Number!"}]}
      >
        <Input />
      </Form.Item>
    </>
  );
};
