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
import { TableCardWithForm} from "../..";
import {
  getSectorList,
  updateSectorData,
} from "../../../pages/api/v1/db/sectorCrud";
import {updateSectorsToDefault} from "../../../pages/api/v1/db/setupDb";
import {sectorData} from "../../../types";

interface CardProps {
  data: any[];
  updateData: (data: sectorData[]) => any;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: sectorData;
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

export const SectorDetailsComponent: FC<CardProps> = ({data, updateData}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string | undefined>("");
  const [isLoading, setisLoading] = useState<boolean>(false);

  const isEditing = (record: sectorData) => record.id === editingKey;

  const edit = (record: Partial<sectorData>) => {
    form.setFieldsValue({...record});
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: string | undefined) => {
    try {
      const row = (await form.validateFields()) as sectorData;
      if (key) {
        await updateSectorData(key, row);
        const newData = await getSectorList();
        updateData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const sectorDataColumns: any[] = [
    {
      title: "id",
      dataIndex: "id",
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
      title: "primary_color",
      dataIndex: "primary_color",
      width: 150,
      editable: true,
      render: (value: any) => <Tag color={value}>{value}</Tag>,
    },
    {
      title: "secondary_color",
      dataIndex: "secondary_color",
      width: 150,
      editable: true,
      render: (value: any) => <Tag color={value}>{value}</Tag>,
    },
    {
      title: "masool_its",
      dataIndex: "masool_its",
      width: 150,
      editable: false,
    },
    {
      title: "masool_name",
      dataIndex: "masool_name",
      width: 150,
      editable: false,
    },
    {
      title: "masool_contact",
      dataIndex: "masool_contact",
      width: 150,
      editable: false,
    },
    {
      title: "masoola_its",
      dataIndex: "masoola_its",
      width: 150,
      editable: false,
    },
    {
      title: "masoola_name",
      dataIndex: "masoola_name",
      width: 150,
      editable: false,
    },
    {
      title: "masoola_contact",
      dataIndex: "masoola_contact",
      width: 150,
      editable: false,
    },
  ];

  const mergedColumns = [
    ...sectorDataColumns,
    {
      title: "operation",
      dataIndex: "operation",
      width: 150,
      fixed: "right",
      render: (_: any, record: sectorData) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
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
      onCell: (record: sectorData) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // const handleAddSector = async (data: sectorData, callback: () => any) => {
  //   const addDataSuccess = await addSectorData({
  //     ...data,
  //     sub_sector_id: [],
  //     ...defaultDatabaseFields,
  //   });
  //   if (addDataSuccess) {
  //     const newData = await getSectorList();
  //     updateData(newData);
  //     callback();
  //   }
  // };

  const resetSectorsToDefault = async () => {
    setisLoading(true);
    await updateSectorsToDefault();
    setisLoading(false);
  };

  return (
    <Form form={form} component={false}>
      <TableCardWithForm
        cardTitle="Mohallah Info"
        TableComponent={Table}
        tableComponentProps={{
          dataSource: data,
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
            <Button onClick={resetSectorsToDefault} className="mr-10">
              Reset Sectors
            </Button>
            <Button className="mr-10">Update Masool Details</Button>
            <Button type="primary">Add Sector</Button>
          </div>
        }
      />
    </Form>
  );
};
