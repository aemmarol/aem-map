import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Result,
  Row,
  Select,
  Statistic,
} from "antd";
import {isEmpty} from "lodash";
import {FC, useEffect, useState} from "react";
import {
  getFileDataByFileNumber,
  getFileDataListBySector,
  getFileDataListBySubsector,
} from "../../pages/api/v1/db/fileCrud";
import {getMemberDataById} from "../../pages/api/v1/db/memberCrud";
import Airtable from "airtable";

const airtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("app7V1cg4ibiooxcn");

const umoorTable = airtableBase("umoorList");

type AddEscalationModalProps = {
  showModal: boolean;
  handleClose: () => any;
  role: string[];
  assignedArea: string[];
};

export const AddEscalationModal: FC<AddEscalationModalProps> = ({
  showModal,
  handleClose,
  assignedArea,
  role,
}) => {
  const [fileForm] = Form.useForm();
  const [escalationForm] = Form.useForm();

  const [allowedFileNumbers, setAllowedFileNumbers] = useState<string[]>([]);
  const [issueTypeOptions, setIssueTypeOptions] = useState<string[]>([]);
  const [showFileNotFoundError, setshowFileNotFoundError] =
    useState<boolean>(false);
  const [fileDetails, setFileDetails] = useState<any>({});

  useEffect(() => {
    getRoleBasedFileNumbers();
    getUmoorList();
  }, []);

  useEffect(() => {
    console.log("files", allowedFileNumbers);
  }, [allowedFileNumbers]);

  const getUmoorList = async () => {
    const temp: any = [];
    await umoorTable
      .select({
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
            temp.push(record.fields);
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
          setIssueTypeOptions(temp);
        }
      );
  };

  const getRoleBasedFileNumbers = async () => {
    if (role.includes("Masool") || role.includes("Masoola")) {
      const fileList = await getFileDataListBySector(assignedArea[0]);
      setAllowedFileNumbers(
        fileList.map((val: any) => val.tanzeem_file_no.toString())
      );
    } else if (role.includes("Musaid") || role.includes("Musaida")) {
      const fileList = await getFileDataListBySubsector(assignedArea[0]);
      setAllowedFileNumbers(fileList.map((val: any) => val.tanzeem_file_no));
    }
  };

  const onFileSearch = async (values: any) => {
    if (!values.fileNumber || !allowedFileNumbers.includes(values.fileNumber)) {
      setshowFileNotFoundError(true);
      setFileDetails({});
    } else {
      const data = await getFileDataByFileNumber(values.fileNumber);
      const hof_data = await getMemberDataById(data.id);
      setFileDetails({
        hofName: hof_data.full_name,
        hofContact: hof_data.mobile,
        subSector: data.sub_sector.name,
      });
      setshowFileNotFoundError(false);
    }
  };

  const handleEscalationFormSubmit = (values: any) => {
    console.log("values", values);
  };

  return (
    <Modal
      footer={null}
      onCancel={handleClose}
      visible={showModal}
      title="Add Escalation"
    >
      <Form
        name="fileSearch"
        onFinish={onFileSearch}
        layout="vertical"
        form={fileForm}
      >
        <Form.Item
          label="File Number"
          name="fileNumber"
          className="mb-8"
          rules={[
            {
              required: true,
              message: "Please enter file number!",
            },
            {
              max: 8,
              message: "Please enter valid file number!",
            },
            () => ({
              validator(_, value) {
                if (!value || !isNaN(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Please enter valid file number!")
                );
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Find
          </Button>
        </Form.Item>
      </Form>
      {showFileNotFoundError ? (
        <Result status="error" title="File not found" />
      ) : null}

      {!isEmpty(fileDetails) ? (
        <>
          <Row className="mb-30" gutter={[12, 16]}>
            <Col xs={24}>
              <Statistic
                valueStyle={{fontSize: 16}}
                title="HOF Name"
                value={fileDetails.hofName}
              />
            </Col>
            <Col xs={12}>
              <Statistic
                valueStyle={{fontSize: 16}}
                title="HOF Contact"
                value={fileDetails.hofContact}
              />
            </Col>
            <Col xs={12}>
              <Statistic
                valueStyle={{fontSize: 16}}
                title="Sub Sector"
                value={fileDetails.subSector}
              />
            </Col>
          </Row>
          <h3>Escalation Form</h3>
          <Form
            name="general"
            onFinish={handleEscalationFormSubmit}
            layout="vertical"
            form={escalationForm}
            initialValues={{
              escalations: [{escalationType: "", escalationComments: ""}],
            }}
          >
            <Form.Item
              name="escalationType"
              label="Issue Category "
              rules={[
                {
                  required: true,
                  message: "select escalation type",
                },
              ]}
            >
              <Select>
                {issueTypeOptions.map((val: any) => (
                  <Select.Option value={val.value} key={val.value}>
                    {val.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="issue"
              label="Issue"
              rules={[
                {
                  required: true,
                  message: "enter Issue",
                },
              ]}
              extra="Please mention name and contact number of the person for issue resolution"
            >
              <Input.TextArea rows={6} placeholder="Issue" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : null}
    </Modal>
  );
};
