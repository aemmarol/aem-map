import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Result,
  Row,
  Select,
  Statistic,
} from "antd";
import {find, isEmpty} from "lodash";
import {FC, useEffect, useState} from "react";
import {
  getFileDataByFileNumber,
  getFileDataListBySector,
  getFileDataListBySubsector,
} from "../../pages/api/v1/db/fileCrud";
import {getMemberDataById} from "../../pages/api/v1/db/memberCrud";
import Airtable from "airtable";
import {authUser, comment, escalationData, userRoles} from "../../types";
import {defaultDatabaseFields} from "../../utils";
import moment from "moment";
import {addEscalationData} from "../../pages/api/v1/db/escalationsCrud";
import {
  getDbSettings,
  incrementEscalationAutoNumber,
} from "../../pages/api/v1/settings";

const airtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("app7V1cg4ibiooxcn");

const umoorTable = airtableBase("umoorList");

type AddEscalationModalProps = {
  showModal: boolean;
  handleClose: () => any;
  adminDetails: authUser;
};

export const AddEscalationModal: FC<AddEscalationModalProps> = ({
  showModal,
  handleClose,
  adminDetails,
}) => {
  const [fileForm] = Form.useForm();
  const [escalationForm] = Form.useForm();

  const [allowedFileNumbers, setAllowedFileNumbers] = useState<string[]>([]);
  const [issueTypeOptions, setIssueTypeOptions] = useState<any[]>([]);
  const [showFileNotFoundError, setshowFileNotFoundError] =
    useState<boolean>(false);
  const [fileDetails, setFileDetails] = useState<any>({});

  useEffect(() => {
    getRoleBasedFileNumbers();
    getUmoorList();
  }, []);

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
    if (
      adminDetails.userRole.includes(userRoles.Masool) ||
      adminDetails.userRole.includes(userRoles.Masoola)
    ) {
      const fileList = await getFileDataListBySector(
        adminDetails.assignedArea[0]
      );
      setAllowedFileNumbers(
        fileList.map((val: any) => val.tanzeem_file_no.toString())
      );
    } else if (
      adminDetails.userRole.includes(userRoles.Musaid) ||
      adminDetails.userRole.includes(userRoles.Musaida)
    ) {
      const fileList = await getFileDataListBySubsector(
        adminDetails.assignedArea[0]
      );
      setAllowedFileNumbers(fileList.map((val: any) => val.tanzeem_file_no));
    }
  };

  const onFileSearch = async (values: any) => {
    if (adminDetails?.userRole.includes(userRoles.Admin)) {
      const data = await getFileDataByFileNumber(values.fileNumber);
      if (!!data) {
        const hof_data = await getMemberDataById(data.id);
        setFileDetails({
          hofName: hof_data.full_name,
          hofContact: hof_data.mobile,
          subSector: data.sub_sector.name,
          fileData: data,
        });
        setshowFileNotFoundError(false);
      } else {
        setshowFileNotFoundError(true);
        setFileDetails({});
      }
    } else {
      if (
        !values.fileNumber ||
        !allowedFileNumbers.includes(values.fileNumber)
      ) {
        setshowFileNotFoundError(true);
        setFileDetails({});
      } else {
        const data = await getFileDataByFileNumber(values.fileNumber);
        const hof_data = await getMemberDataById(data.id);
        setFileDetails({
          hofName: hof_data.full_name,
          hofContact: hof_data.mobile,
          subSector: data.sub_sector.name,
          fileData: data,
        });
        setshowFileNotFoundError(false);
      }
    }
  };

  const handleEscalationFormSubmit = async (values: any) => {
    const dbSettings = await getDbSettings();
    const firstComment: comment = {
      msg: "Issue is added on " + moment(new Date()).format("DD-MM-YYYY"),
      name: adminDetails.name,
      contact_number: adminDetails.contact,
      userRole: adminDetails.userRole.includes(userRoles.Masool)
        ? "Masool"
        : adminDetails.userRole.includes(userRoles.Masoola)
        ? "Masoola"
        : adminDetails.userRole.includes(userRoles.Musaid)
        ? "Musaid"
        : adminDetails.userRole.includes(userRoles.Musaida)
        ? "Musaida"
        : adminDetails.userRole[0],
      time: moment(new Date()).format(),
    };
    const escalationIssueType = find(issueTypeOptions, {
      value: values.escalationType,
    });
    const data: escalationData = {
      ...defaultDatabaseFields,
      created_by: {
        name: adminDetails.name,
        its_number: adminDetails.itsId,
        contact_number: adminDetails.contact,
        userRole: firstComment.userRole,
      },
      file_details: {
        tanzeem_file_no: fileDetails.fileData.tanzeem_file_no,
        address: fileDetails.fileData.address,
        sub_sector: fileDetails.fileData.sub_sector,
        hof_its: fileDetails.fileData.id,
        hof_name: fileDetails.hofName,
        hof_contact: fileDetails.hofContact,
      },
      status: "Issue Reported",
      issue: values.issue,
      type: escalationIssueType,
      comments: [firstComment],
      escalation_id: "esc-" + dbSettings.escalation_auto_number,
    };
    const result = await addEscalationData(data);
    if (result) {
      await incrementEscalationAutoNumber(
        dbSettings.escalation_auto_number + 1
      );
      message.success("Escalation added!");
      escalationForm.resetFields();
      fileForm.resetFields();
      handleClose();
    }
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
              <Select
                showSearch={true}
                filterOption={(inputValue, option: any) =>
                  option.props.children
                    .toString()
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                }
              >
                {issueTypeOptions.map((val: any) => (
                  <Select.Option
                    label={val.label}
                    value={val.value}
                    key={val.value}
                  >
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
