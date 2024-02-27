import {Button, Form, Input, Modal, Popconfirm, Table, Typography} from "antd";
import {FC, useState} from "react";
import {umoorData} from "../../../types";
import {TableCardWithForm} from "../../cards";
import {
    addUmoorData,
  getUmoorList,
  updateUmoorData,
} from "../../../pages/api/v2/services/umoor";

interface CardProps {
  data: any[];
  updateData: (data: any) => any;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  record: umoorData;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  children,
  ...restProps
}) => {
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
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const UmoorListComponent: FC<CardProps> = ({data, updateData}) => {
  const [form] = Form.useForm();
  const [addUmoorForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string | undefined>("");
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [showAddUmoor, setShowAddUmoor] = useState<boolean>(false);

  const isEditing = (record: umoorData) => record._id === editingKey;

  const edit = (record: Partial<umoorData>) => {
    form.setFieldsValue({...record});
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: string | undefined) => {
    setisLoading(true);
    try {
      const row = await form.validateFields();
      if (key) {
        await updateUmoorData(key, row);
        getUmoorList().then((data: umoorData[]) => {
          updateData(data);
        });
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    } finally {
      setisLoading(false);
    }
  };

  const umoorDataColumns: any[] = [
    {
      title: "value",
      dataIndex: "value",
      editable: true,
      width: 150,
    },
    {
      title: "label",
      dataIndex: "label",
      editable: true,
      width: 150,
    },
  ];

  const mergedColumns = [
    ...umoorDataColumns,
    {
      title: "operation",
      dataIndex: "operation",
      width: 150,
      fixed: "right",
      render: (_: any, record: umoorData) => {
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
      onCell: (record: umoorData) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const addUmoor = ()=>setShowAddUmoor(true);

  const handleSubmitAddUmoorForm = async(values:Partial<umoorData>)=>{
    addUmoorData(values).then(()=>{
        setisLoading(true)
        getUmoorList().then((data: umoorData[]) => {
            updateData(data);
          }).finally(()=>{
            setisLoading(false)
          })
    }).finally(()=>{
        setShowAddUmoor(false)
    })
  }

  return (
    <>
    <Form form={form} component={false}>
      <TableCardWithForm
        cardTitle="UmoorList"
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
            <Button onClick={addUmoor} className="mr-10">
              Add umoor
            </Button>
          </div>
        }
      />
    </Form>
    {
        showAddUmoor ?
        <Modal
      footer={null}
      onCancel={()=>setShowAddUmoor(false)}
      visible={showAddUmoor}
      title="Add Umoor"
    >
      <Form
        name="escalationComments"
        onFinish={handleSubmitAddUmoorForm}
        layout="vertical"
        form={addUmoorForm}
      >
        <Form.Item
          label="Label"
          name="label"
          className="mb-8"
          rules={[
            {
              required: true,
              message: "Label cannot be empty!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Value"
          name="value"
          className="mb-8"
          rules={[
            {
              required: true,
              message: "Value cannot be empty!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>:null
    }
    </>
  );
};
