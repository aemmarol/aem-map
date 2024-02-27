import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Tag,
  Typography,
} from "antd";
import {FC, useState} from "react";
import {TableCardWithForm} from "../..";

import {
  getSubSectorList,
  updateSubSectorData,
  updateSubSectorListToDefault,
} from "../../../pages/api/v2/services/subsector";
import {subSectorData} from "../../../types";

interface CardProps {
  data: any[];
  updateData: (data: subSectorData[]) => any;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: subSectorData;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{margin: 0}}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const SubSectorDetailsComponent: FC<CardProps> = ({
  data,
  updateData,
}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string | undefined>("");
  const [isLoading, setisLoading] = useState<boolean>(false);

  const isEditing = (record: subSectorData) => record._id === editingKey;

  const edit = (record: Partial<subSectorData>) => {
    form.setFieldsValue({...record});
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: string | undefined) => {
    try {
      const row = (await form.validateFields()) as subSectorData;
      if (key) {
        await updateSubSectorData(key, row);
        getSubSectorList((data: subSectorData[]) => {
          updateData(data);
        });
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const sectorDataColumns: any[] = [
    {
      title: "id",
      dataIndex: "_id",
      width: 100,
      editable: false,
      fixed: "left",
    },
    {
      title: "name",
      dataIndex: "name",
      width: 150,
      editable: false,
      fixed: "left",
    },
    {
      title: "Sector",
      width: 150,
      editable: false,
      render: (_: any, record: subSectorData) => (
        <Tag color={record?.sector?.primary_color}>{record?.sector?.name}</Tag>
      ),
    },

    {
      title: "musaid_its",
      dataIndex: "musaid_its",
      width: 150,
      editable: true,
    },
    {
      title: "musaid_name",
      dataIndex: "musaid_name",
      width: 150,
      editable: true,
    },
    {
      title: "musaid_contact",
      dataIndex: "musaid_contact",
      width: 150,
      editable: true,
    },
    {
      title: "musaida_its",
      dataIndex: "musaida_its",
      width: 150,
      editable: true,
    },
    {
      title: "musaida_name",
      dataIndex: "musaida_name",
      width: 150,
      editable: true,
    },
    {
      title: "musaida_contact",
      dataIndex: "musaida_contact",
      width: 150,
      editable: true,
    },
  ];

  const mergedColumns = [
    ...sectorDataColumns,
    {
      title: "operation",
      dataIndex: "operation",
      width: 150,
      fixed: "right",
      render: (_: any, record: subSectorData) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
              style={{marginRight: 8}}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ].map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: subSectorData) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const resetSubSectorsToDefault = async () => {
    setisLoading(true);
    await updateSubSectorListToDefault();
    await getSubSectorList((data: subSectorData[]) => {
      updateData(data);
    });
    setisLoading(false);
  };

  const handleUpdateMusaidDetails = async () => {
    console.log("update musaid");
  };

  return (
    <Form form={form} component={false}>
      <TableCardWithForm
        cardTitle="Sub Sector Info"
        TableComponent={Table}
        tableComponentProps={{
          dataSource: data.map((val, index) => ({
            ...val,
            key: index,
          })),
          columns: mergedColumns,
          pagination: false,
          scroll: {x: "450px", y: "400px"},
          components: {
            body: {
              cell: EditableCell,
            },
          },
          loading: isLoading,
        }}
        extraComponents={
          <div className="flex-align-center-justify-center">
            <Button onClick={resetSubSectorsToDefault} className="mr-10">
              Reset SubSectors
            </Button>
            <Button onClick={handleUpdateMusaidDetails} className="mr-10">
              Update Musaid Details
            </Button>
          </div>
        }
      />
    </Form>
  );
};
