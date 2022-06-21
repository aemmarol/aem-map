import {Form, Input, Select} from "antd";
import {FC, useEffect, useState} from "react";
import {getSectorList} from "../../pages/api/v2/services/sector";
import {sectorData} from "../../types";

export const SubSectorFormFields: FC = () => {
  const [sectorDetails, setsectorDetails] = useState<sectorData[]>([]);

  const getSectorDetails = async () => {
    await getSectorList((data: sectorData[]) => setsectorDetails(data));
  };

  useEffect(() => {
    getSectorDetails();
  }, []);

  return (
    <>
      <Form.Item
        label="SubSector Name"
        name="name"
        rules={[{required: true, message: "Please input field name!"}]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Mohallah"
        name="sector"
        rules={[{required: true, message: "Please select mohallah!"}]}
      >
        <Select>
          {sectorDetails.map((value) => (
            <Select.Option
              key={value._id}
              value={
                value._id +
                "|" +
                value.name +
                "|" +
                value.primary_color +
                "|" +
                value.secondary_color
              }
            >
              {value.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="musaid Name"
        name="musaid_name"
        rules={[{required: true, message: "Please input musaid Name!"}]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="musaid ITS Number"
        name="musaid_its"
        rules={[{required: true, message: "Please input ITS Number!"}]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="musaid Contact Number"
        name="musaid_contact"
        rules={[{required: true, message: "Please input Contact Number!"}]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="musaida Name"
        name="musaida_name"
        rules={[{required: true, message: "Please input musaida Name!"}]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="musaida ITS Number"
        name="musaida_its"
        rules={[{required: true, message: "Please input ITS Number!"}]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="musaida Contact Number"
        name="musaida_contact"
        rules={[{required: true, message: "Please input Contact Number!"}]}
      >
        <Input />
      </Form.Item>
    </>
  );
};
