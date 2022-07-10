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
  comment,
  escalationData,
  escalationStatus,
  fileDetails,
  userRoles,
} from "../../types";
import {defaultDatabaseFields, getauthToken} from "../../utils";
import moment from "moment";

import {getUmoorList} from "../../pages/api/v2/services/umoor";
import {
  getFileDataByFileNumber,
  getFileDataList,
  getFileDataListBySector,
  getFileDataListBySubsector,
} from "../../pages/api/v2/services/file";
import {
  getMemberDataById,
  getMemberListByHofId,
} from "../../pages/api/v2/services/member";
import {getSettings} from "../../pages/api/v2/services/settings";
import {
  addEscalationData,
  getEscalationData,
} from "../../pages/api/v2/services/escalation";
import {API} from "../../utils/api";
import {useEscalationContext} from "../../context/EscalationContext";
import {sendNewEscalationEmail} from "../../pages/api/v2/services/email";

type AddEscalationModalProps = {
  showModal: boolean;
  handleClose: () => any;
  successCallBack: () => any;
};

export const AddEscalationModal: FC<AddEscalationModalProps> = ({
  showModal,
  handleClose,
  successCallBack,
}) => {
  const [fileForm] = Form.useForm();
  const [escalationForm] = Form.useForm();
  const {adminDetails} = useEscalationContext();

  const [allowedFileNumbers, setAllowedFileNumbers] = useState<any[]>([]);
  const [issueTypeOptions, setIssueTypeOptions] = useState<any[]>([]);
  const [showFileNotFoundError, setshowFileNotFoundError] =
    useState<boolean>(false);
  const [fileDetails, setFileDetails] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    getRoleBasedFileNumbers();
    setUmoorList();
  }, []);

  const setUmoorList = async () => {
    getUmoorListfromDb();
  };

  const getUmoorListfromDb = async () => {
    const umoorList = await getUmoorList();
    setIssueTypeOptions(umoorList);
  };

  const getRoleBasedFileNumbers = async () => {
    let fileList: any = [];
    if (
      adminDetails.userRole.includes(userRoles.Masool) ||
      adminDetails.userRole.includes(userRoles.Masoola)
    ) {
      await getFileDataListBySector(
        adminDetails.assignedArea[0],
        (data: any) => {
          fileList = data;
        }
      );
    } else if (
      adminDetails.userRole.includes(userRoles.Musaid) ||
      adminDetails.userRole.includes(userRoles.Musaida)
    ) {
      await getFileDataListBySubsector(
        adminDetails.assignedArea[0],
        (data: any) => {
          fileList = data;
        }
      );
    } else if (
      adminDetails.userRole.includes(userRoles.Admin) ||
      adminDetails.userRole.includes(userRoles.Umoor)
    ) {
      await getFileDataList((data: any) => {
        fileList = data;
      });
    }
    if (fileList) {
      setAllowedFileNumbers(
        fileList
          .filter((val: any) => val.tanzeem_file_no)
          .map((val: fileDetails) => {
            return {
              value: val.tanzeem_file_no,
              label: `${val.tanzeem_file_no} (${val.hof_name})`,
            };
          })
      );
    }
  };

  const onFileSelect = async (values: any) => {
    await getFileDataByFileNumber(values, async (data: any) => {
      if (!isEmpty(data)) {
        let hof_data: any = {};
        await getMemberDataById(data._id, (newdata: any) => {
          hof_data = newdata;
        });
        let membersList: any = [];
        await getMemberListByHofId(hof_data._id, (newdata: any) => {
          membersList = newdata;
        });
        setFileDetails({
          _id: hof_data._id,
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
    });
  };

  const handleEscalationFormSubmit = async (values: any) => {
    const dbSettings: any = await getSettings();
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
    const escalationRaisedForDetails = JSON.parse(
      values.escalationRaisedForITS
    );
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
        hof_its: fileDetails.fileData._id,
        hof_name: fileDetails.hofName,
        hof_contact: fileDetails.hofContact,
      },
      status: escalationStatus.ISSUE_REPORTED,
      issue: values.issue,
      type: escalationIssueType,
      comments: [firstComment],
      escalation_id: "esc-" + dbSettings.escalation_auto_number,
      issueRaisedFor: {
        ITS: escalationRaisedForDetails.its.toString(),
        name: escalationRaisedForDetails.name.toString(),
        contact: values.escalationRaisedForContact,
      },
    };

    setIsSubmitting(true);

    await addEscalationData(data).then(async (response) => {
      await fetch(API.settings, {
        method: "PUT",
        headers: {...getauthToken()},
      });

      await getEscalationData(
        response.insertedId,
        async (escalationData: escalationData) => {
          await sendNewEscalationEmail(escalationData);
        }
      );

      message.success("Escalation added!");
      escalationForm.resetFields();
      fileForm.resetFields();
      await successCallBack();
      setIsSubmitting(false);
      handleClose();
    });
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
                {fileDetails.membersList &&
                  fileDetails.membersList.map((memberData: any) => (
                    <Select.Option
                      label={`${memberData._id} (${memberData.full_name})`}
                      value={JSON.stringify({
                        its: memberData._id,
                        name: memberData.full_name,
                      })}
                      key={memberData._id}
                    >
                      {`${memberData._id} (${memberData.full_name})`}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="escalationRaisedForContact"
              label="Issue raised for (Enter contact)"
              rules={[
                {
                  required: true,
                  message: "Please Enter a contact number",
                },
                {
                  pattern: new RegExp(/^(\+[\d]{1,5}|0)?[7-9]\d{9}$/),
                  message: "Please Enter a valid contact number",
                },
              ]}
              validateTrigger="onBlur"
            >
              <Input />
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
              <Button disabled={isSubmitting} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : null}
    </Modal>
  );
};
