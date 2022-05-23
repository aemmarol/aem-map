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
  getFileDataList,
  getFileDataByFileNumber,
  getFileDataListBySector,
  getFileDataListBySubsector,
} from "../../pages/api/v1/db/fileCrud";
import {
  getMemberDataById,
  getMemberListByHofId,
} from "../../pages/api/v1/db/memberCrud";
// import Airtable from "airtable";
import {
  authUser,
  comment,
  escalationData,
  escalationStatus,
  fileDetails,
  userRoles,
} from "../../types";
import {defaultDatabaseFields} from "../../utils";
import moment from "moment";
import {addEscalationData} from "../../pages/api/v1/db/escalationsCrud";
import {
  getDbSettings,
  incrementEscalationAutoNumber,
} from "../../pages/api/v1/settings";
import {getUmoorList} from "../../pages/api/v1/db/umoorsCrud";

// const airtableBase = new Airtable({
//   apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
// }).base("app7V1cg4ibiooxcn");

// const umoorTable = airtableBase("umoorList");

type AddEscalationModalProps = {
  showModal: boolean;
  handleClose: () => any;
  adminDetails: authUser;
  submitCallback: () => any;
};

export const AddEscalationModal: FC<AddEscalationModalProps> = ({
  showModal,
  handleClose,
  adminDetails,
  submitCallback,
}) => {
  const [fileForm] = Form.useForm();
  const [escalationForm] = Form.useForm();

  const [allowedFileNumbers, setAllowedFileNumbers] = useState<any[]>([]);
  const [issueTypeOptions, setIssueTypeOptions] = useState<any[]>([]);
  const [showFileNotFoundError, setshowFileNotFoundError] =
    useState<boolean>(false);
  const [fileDetails, setFileDetails] = useState<any>({});

  useEffect(() => {
    getRoleBasedFileNumbers();
    setUmoorList();
  }, []);

  const setUmoorList = async () => {
    // const temp: any = [];
    getUmoorListfromDb();
  };

  const getUmoorListfromDb = async () => {
    const umoorList = await getUmoorList();
    setIssueTypeOptions(umoorList);
  };

  const getRoleBasedFileNumbers = async () => {
    let fileList;
    if (
      adminDetails.userRole.includes(userRoles.Masool) ||
      adminDetails.userRole.includes(userRoles.Masoola)
    ) {
      fileList = await getFileDataListBySector(adminDetails.assignedArea[0]);
      // setAllowedFileNumbers(
      //   fileList.map((val: any) => val.tanzeem_file_no.toString())
      // );
    } else if (
      adminDetails.userRole.includes(userRoles.Musaid) ||
      adminDetails.userRole.includes(userRoles.Musaida)
    ) {
      fileList = await getFileDataListBySubsector(adminDetails.assignedArea[0]);
      // setAllowedFileNumbers(fileList.map((val: any) => val.tanzeem_file_no));
    } else if (
      adminDetails.userRole.includes(userRoles.Admin) ||
      adminDetails.userRole.includes(userRoles.Umoor)
    ) {
      fileList = await getFileDataList();
    }
    if (fileList) {
      setAllowedFileNumbers(
        fileList.map((val: fileDetails) => {
          return {
            value: val.tanzeem_file_no,
            label: `${val.tanzeem_file_no} (${val.hof_name})`,
          };
        })
      );
    }
  };

  // const onFileSearch = async (values: any) => {
  //   if (adminDetails?.userRole.includes(userRoles.Admin)) {
  //     const data = await getFileDataByFileNumber(values.fileNumber);
  //     if (!!data) {
  //       const hof_data = await getMemberDataById(data.id);
  //       // const hof_me
  //       console.log(hof_data, data);
  //       setFileDetails({
  //         id: hof_data.id,
  //         hofName: hof_data.full_name,
  //         hofContact: hof_data.mobile,
  //         subSector: data.sub_sector.name,
  //         fileData: data,
  //       });
  //       setshowFileNotFoundError(false);
  //     } else {
  //       setshowFileNotFoundError(true);
  //       setFileDetails({});
  //     }
  //   } else {
  //     if (
  //       !values.fileNumber ||
  //       !allowedFileNumbers.map((val) => val.value).includes(values.fileNumber)
  //     ) {
  //       setshowFileNotFoundError(true);
  //       setFileDetails({});
  //     } else {
  //       const data = await getFileDataByFileNumber(values.fileNumber);
  //       const hof_data = await getMemberDataById(data.id);
  //       setFileDetails({
  //         hofName: hof_data.full_name,
  //         hofContact: hof_data.mobile,
  //         subSector: data.sub_sector.name,
  //         fileData: data,
  //       });
  //       setshowFileNotFoundError(false);
  //     }
  //   }
  // };

  const onFileSelect = async (values: any) => {
    // console.log(values);
    const data = await getFileDataByFileNumber(values);
    if (!!data) {
      const hof_data = await getMemberDataById(data.id);
      const membersList = await getMemberListByHofId(hof_data.id);
      console.log(membersList);
      console.log(hof_data, data);
      setFileDetails({
        id: hof_data.id,
        hofName: hof_data.full_name,
        hofContact: hof_data.mobile,
        subSector: data.sub_sector.name,
        fileData: data,
        membersList,
      });
      setshowFileNotFoundError(false);
    } else {
      setshowFileNotFoundError(true);
      setFileDetails({});
    }
  };

  const handleEscalationFormSubmit = async (values: any) => {
    console.log(values);
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
      time: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
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
      status: escalationStatus.ISSUE_REPORTED,
      issue: values.issue,
      type: escalationIssueType,
      comments: [firstComment],
      escalation_id: "esc-" + dbSettings.escalation_auto_number,
      issueRaisedFor: values.escalationRaisedForITS,
    };
    const result = await addEscalationData(data);
    if (result) {
      await incrementEscalationAutoNumber(
        dbSettings.escalation_auto_number + 1
      );
      message.success("Escalation added!");
      escalationForm.resetFields();
      fileForm.resetFields();
      submitCallback();
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
        onFinish={onFileSelect}
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
            // {
            //   max: 8,
            //   message: "Please enter valid file number!",
            // },
            // () => ({
            //   validator(_, value) {
            //     if (!value || !isNaN(value)) {
            //       return Promise.resolve();
            //     }
            //     return Promise.reject(
            //       new Error("Please enter valid file number!")
            //     );
            //   },
            // }),
          ]}
        >
          {/* <Input /> */}
          <Select
            showSearch={true}
            filterOption={(inputValue, option: any) =>
              option.props.children
                .toString()
                .toLowerCase()
                .includes(inputValue.toLowerCase())
            }
            onChange={(id) => onFileSelect(id)}
          >
            {allowedFileNumbers.map((val: any) => (
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

        {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Find
          </Button>
        </Form.Item> */}
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
              name="escalationRaisedForITS"
              label="Issue raised for (Enter ITS)"
              rules={[
                {
                  required: true,
                  message:
                    "Enter ITS of person for which issue is being raised.",
                },
                // {min: 8, message: "ITS ID cannot be less than 8 characters"},
                // {max: 8, message: "ITS ID cannot be greater than 8 characters"},
                // {
                //   pattern: new RegExp(/^[0-9]+$/),
                //   message: "ITS ID should be a number",
                // },
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
                {fileDetails.membersList.map((memberData: any) => (
                  <Select.Option
                    label={`${memberData.id} (${memberData.full_name})`}
                    value={memberData.id}
                    key={memberData.id}
                  >
                    {`${memberData.id} (${memberData.full_name})`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
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
