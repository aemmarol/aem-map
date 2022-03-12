import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Tag,
  Typography,
} from "antd";
import {FC, useState} from "react";
import {TableCardWithForm, SubSectorFormFields} from "../..";
import {addSubSectorIds} from "../../../pages/api/v1/db/sectorCrud";
import {
  addSubSectorData,
  getSubSectorList,
  updateSubSectorData,
} from "../../../pages/api/v1/db/subSectorCrud";
import {subSectorData} from "../../../types";
import {defaultDatabaseFields} from "../../../utils";

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

  const isEditing = (record: subSectorData) => record.id === editingKey;

  const edit = (record: Partial<subSectorData>) => {
    form.setFieldsValue({...record});
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: string | undefined) => {
    try {
      const row = (await form.validateFields()) as subSectorData;
      if (key) {
        await updateSubSectorData(key, row);
        const newData = await getSubSectorList();
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
      title: "Sector",
      width: 150,
      editable: false,
      render: (_: any, record: subSectorData) => (
        <Tag>{record.sector.name}</Tag>
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
      onCell: (record: subSectorData) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleAddSector = async (data: any, callback: () => any) => {
    const sectorDetails = data.sector.split("|");
    const addDataSuccess = await addSubSectorData({
      ...data,
      ...defaultDatabaseFields,
      sector: {
        id: sectorDetails[0],
        name: sectorDetails[1],
      },
    });
    if (addDataSuccess) {
      await addSubSectorIds(sectorDetails[0] as string, addDataSuccess);
      const newData = await getSubSectorList();
      updateData(newData);
      callback();
    }
  };

  return (
    <Form form={form} component={false}>
      <TableCardWithForm
        cardTitle="Sub Sector Info"
        modalTitle="Add Sub Sector Form"
        addBtnText="Add Sub Sector"
        onFormSubmit={handleAddSector}
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
        }}
        formFields={<SubSectorFormFields />}
      />
    </Form>
  );
};
