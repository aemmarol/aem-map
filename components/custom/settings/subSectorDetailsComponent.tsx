import Airtable from "airtable";
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
import {updateSubSectorsToDefault} from "../../../pages/api/v1/db/setupDb";
import {
  getSubSectorDataByName,
  getSubSectorList,
  updateSubSectorData,
} from "../../../pages/api/v1/db/subSectorCrud";
import {subSectorData} from "../../../types";

const airtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("app7V1cg4ibiooxcn");

const userTable = airtableBase("userList");

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
        <Tag color={record.sector.primary_color}>{record.sector.name}</Tag>
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

  // const handleAddSector = async (data: any, callback: () => any) => {
  //   const sectorDetails = data.sector.split("|");
  //   const addDataSuccess = await addSubSectorData({
  //     ...data,
  //     ...defaultDatabaseFields,
  //     sector: {
  //       id: sectorDetails[0],
  //       name: sectorDetails[1],
  //       primary_color: sectorDetails[2],
  //       secondary_color: sectorDetails[3],
  //     },
  //     number_of_males: 0,
  //     number_of_females: 0,
  //     files: [],
  //   });
  //   if (addDataSuccess) {
  //     await addSubSectorIds(sectorDetails[0] as string, addDataSuccess);
  //     const newData = await getSubSectorList();
  //     updateData(newData);
  //     callback();
  //   }
  // };

  const resetSubSectorsToDefault = async () => {
    setisLoading(true);
    await updateSubSectorsToDefault();
    setisLoading(false);
  };

  const handleUpdateMusaidDetails = async () => {
    setisLoading(true);
    const musaidData = await userTable
      .select({
        view: "Grid view",
        filterByFormula: `({userRole} = 'Musaid')`,
      })
      .firstPage();
    const musaidaData = await userTable
      .select({
        view: "Grid view",
        filterByFormula: `({userRole} = 'Musaida')`,
      })
      .firstPage();

    await Promise.all(
      musaidData
        .map((val) => val.fields)
        .map(async (value: any) => {
          const tempSector = await getSubSectorDataByName(
            value.assignedArea[0]
          );
          await updateSubSectorData(tempSector.id as string, {
            musaid_contact: value.contact,
            musaid_name: value.name,
            musaid_its: value.itsId.toString(),
          });
        })
    );

    await Promise.all(
      musaidaData
        .map((val) => val.fields)
        .map(async (value: any) => {
          const tempSector = await getSubSectorDataByName(
            value.assignedArea[0]
          );
          await updateSubSectorData(tempSector.id as string, {
            musaida_contact: value.contact,
            musaida_name: value.name,
            musaida_its: value.itsId.toString(),
          });
        })
    );

    const newData = await getSubSectorList();
    updateData(newData);

    setisLoading(false);
  };

  return (
    <Form form={form} component={false}>
      <TableCardWithForm
        cardTitle="Sub Sector Info"
        TableComponent={Table}
        tableComponentProps={{
          dataSource: data.map((val, index) => ({...val, key: index})),
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
            <Button type="primary">Add Sub Sector</Button>
          </div>
        }
      />
    </Form>
  );
};
