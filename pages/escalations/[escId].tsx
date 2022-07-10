import {Button, Card, Col, Divider, message, Row, Select} from "antd";
import _, {find, isEmpty} from "lodash";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {EscStat} from "../../components/custom/escalations/escalationStatus";
import {useGlobalContext} from "../../context/GlobalContext";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {
  authUser,
  comment,
  escalationData,
  sectorData,
  subSectorData,
  escalationStatus,
  userRoles,
  umoorData,
} from "../../types";
import {logout, verifyUser} from "../api/v1/authentication";

import moment from "moment";
import styles from "../../styles/pages/Escalation.module.scss";
import {AddEscalationCommentsModal} from "../../components";
import {getSectorDataByName} from "../api/v2/services/sector";
import {getUmoorList} from "../api/v2/services/umoor";
import {getSubSectorDataByName} from "../api/v2/services/subsector";
import {
  getEscalationData,
  updateEscalationData,
} from "../api/v2/services/escalation";

const FileMemberDetailsPage: NextPage = () => {
  const router = useRouter();
  const {escId} = router.query;
  const {toggleLoader, changeSelectedSidebarKey} = useGlobalContext();

  const [escalationDetails, setEscalationDetails] = useState<escalationData>(
    {} as escalationData
  );
  const [adminDetails, setAdminDetails] = useState<authUser>({} as authUser);
  const [issueTypeOptions, setIssueTypeOptions] = useState<umoorData[]>([]);
  const [selectIssueValue, setselectIssueValue] = useState<string>("");
  const [selectStatusValue, setSelectStatusValue] = useState<string>("");
  const [issueComments, setIssueComments] = useState<comment[]>([]);
  const [showAddCommentsModal, setShowAddCommentsModal] =
    useState<boolean>(false);
  const [sectorDetails, setSectorDetails] = useState<sectorData>();
  const [subSectorDetails, setSubSectorDetails] = useState<subSectorData>();

  useEffect(() => {
    if (escId) {
      changeSelectedSidebarKey("2");
      if (typeof verifyUser() !== "string") {
        const user = verifyUser() as authUser;
        const {userRole} = user;
        if (
          userRole.includes(userRoles.Admin) ||
          userRole.includes(userRoles.Umoor)
        ) {
          getEscatationDetails(escId as string);
          setAdminDetails(user);
          getUmoorListfromDb();
        } else {
          notVerifierUserLogout();
        }
      } else {
        notVerifierUserLogout();
      }
    }
  }, [escId]);

  useEffect(() => {
    if (!_.isEmpty(escalationDetails)) {
      setSectorDetailsFromDB(escalationDetails);
      setSubSectorDetailsFromDB(escalationDetails);
    }
  }, [escalationDetails]);

  const setSectorDetailsFromDB = async (escDetails: escalationData) => {
    if (escDetails.file_details.sub_sector.sector?.name) {
      await getSectorDataByName(
        escDetails.file_details.sub_sector.sector?.name,
        (data: sectorData) => setSectorDetails(data)
      );
    }
  };

  const setSubSectorDetailsFromDB = async (escDetails: escalationData) => {
    if (escDetails.file_details.sub_sector.name) {
      await getSubSectorDataByName(
        escDetails.file_details.sub_sector.name,
        (data: subSectorData) => {
          setSubSectorDetails(data);
        }
      );
    }
  };

  const getUmoorListfromDb = async () => {
    const umoorList: umoorData[] = await getUmoorList();
    setIssueTypeOptions(umoorList);
  };

  const getEscatationDetails = async (id: string) => {
    toggleLoader(true);
    await getEscalationData(id, (data: escalationData) => {
      if (!isEmpty(data)) {
        setEscalationDetails(data);
        setselectIssueValue(getIssueType(data.type, "value"));
        setSelectStatusValue(data.status);
        setIssueComments(data.comments);
        toggleLoader(false);
      } else {
        toggleLoader(false);
        router.push("/");
      }
    });
  };

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  const getIssueType = (type: any, returnType: string) => {
    return type[returnType] || "";
  };

  const handleSelectIssueChange = async (val: string) => {
    toggleLoader(true);
    await updateEscalation("type", val, userRoles.Admin);
    await getEscatationDetails(escId as string);
    message.success("Escalation type Changed!");
    toggleLoader(false);
  };

  const handleSelectStatusChange = async (val: string) => {
    toggleLoader(true);
    await updateEscalation("status", val, adminDetails.userRole[0]);
    await getEscatationDetails(escId as string);
    message.success("Status Changed!");
    toggleLoader(false);
  };

  const updateEscalation = async (
    field: string,
    value: string,
    currentUserRole: string
  ) => {
    const valueBasedOnField: any =
      field === "type"
        ? find(issueTypeOptions, {value})
        : field === "status"
        ? value
        : "";

    const msgValue =
      field === "type" ? valueBasedOnField.label : valueBasedOnField;
    const newMsg =
      adminDetails.name +
      " changed " +
      field +
      " to " +
      msgValue +
      " on " +
      moment(new Date()).format("DD-MM-YYYY hh:mm A");
    const currentCommentsArr = [...escalationDetails.comments];
    const newComment: comment = {
      name: adminDetails.name,
      msg: newMsg,
      contact_number: adminDetails.contact,
      userRole: currentUserRole,
      time: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
    };
    currentCommentsArr.push(newComment);

    const data: any = {
      comments: newComment,
      [field]: valueBasedOnField,
      updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
    };

    await updateEscalationData(escId as string, data);
  };

  return (
    <Dashboardlayout
      backgroundColor="#efefef"
      headerTitle={
        escalationDetails && escalationDetails.escalation_id
          ? escalationDetails.escalation_id
          : ""
      }
      showBackButton={true}
    >
      <Row className="mb-16" gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, 16]}>
        <Col md={4} />
        <Col xs={24} md={16}>
          {!isEmpty(escalationDetails) ? (
            <Card className="border-radius-10">
              <h2 className="mb-30">{escalationDetails.issue}</h2>
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={16}>
                  <EscStat
                    label="HOF Name"
                    value={escalationDetails.file_details.hof_name}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  {adminDetails.userRole.includes(userRoles.Admin) ? (
                    <>
                      <p className={styles.escStatLabel}>Escalation type</p>
                      <Select
                        onChange={handleSelectIssueChange}
                        value={selectIssueValue}
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
                    </>
                  ) : (
                    <EscStat
                      label="Issue Type"
                      value={
                        getIssueType(escalationDetails.type, "label") as string
                      }
                      type="tag"
                    />
                  )}
                </Col>
                <Col xs={12} sm={8}>
                  <EscStat
                    label="File No"
                    value={
                      escalationDetails.file_details.tanzeem_file_no as string
                    }
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <EscStat
                    label="HOF ITS"
                    value={escalationDetails.file_details.hof_its}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <EscStat
                    label="HOF Contact number"
                    value={escalationDetails.file_details.hof_contact}
                  />
                </Col>
                <Col xs={24} sm={24}>
                  <EscStat
                    label="Address"
                    value={escalationDetails.file_details.address}
                  />
                </Col>
              </Row>
              <Divider />

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <EscStat
                    label="Reported On"
                    value={moment(
                      escalationDetails.created_at,
                      "DD-MM-YYYY HH:mm:ss"
                    ).format("DD-MM-YYYY")}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <EscStat
                    label="Reported by"
                    value={escalationDetails.created_by.name}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <EscStat
                    label="Reported by Contact"
                    value={escalationDetails.created_by.contact_number}
                  />
                </Col>
                {escalationDetails.issueRaisedFor ? (
                  <>
                    <Col xs={24} sm={8}>
                      <EscStat
                        label="Reported for"
                        value={escalationDetails.issueRaisedFor.name}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <EscStat
                        label="Reported for ITS"
                        value={escalationDetails.issueRaisedFor.ITS}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <EscStat
                        label="Reported for Contact Number"
                        value={escalationDetails.issueRaisedFor.contact}
                      />
                    </Col>
                  </>
                ) : (
                  <Col xs={24} sm={8}>
                    <EscStat label="Reported For" value={"HOF"} />
                  </Col>
                )}

                {sectorDetails ? (
                  <>
                    <Col xs={24} sm={8}>
                      <EscStat
                        label="Mohallah"
                        value={sectorDetails.name as string}
                        type="tag"
                        tagColor={sectorDetails.primary_color as string}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <EscStat
                        label="Masool"
                        value={`${sectorDetails.masool_name} (${sectorDetails.masool_contact})`}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <EscStat
                        label="Masoola"
                        value={`${sectorDetails.masoola_name} (${sectorDetails.masoola_contact})`}
                      />
                    </Col>
                  </>
                ) : null}
                {subSectorDetails ? (
                  <>
                    <Col xs={12} sm={8}>
                      <EscStat
                        label="SubSector"
                        value={`${subSectorDetails.name}`}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <EscStat
                        label="Musaid"
                        value={`${subSectorDetails.musaid_name} (${subSectorDetails.musaid_contact})`}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <EscStat
                        label="Musaida"
                        value={`${subSectorDetails.musaida_name} (${subSectorDetails.musaida_contact})`}
                      />
                    </Col>
                  </>
                ) : null}
              </Row>
              <Divider />
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={12}>
                  <p className={styles.escStatLabel}>Status</p>
                  <Select
                    onChange={handleSelectStatusChange}
                    value={selectStatusValue}
                    className="width-200"
                  >
                    {Object.values(escalationStatus).map((escStatus) => {
                      return (
                        <Select.Option
                          label={escStatus}
                          value={escStatus}
                          key={escStatus}
                        >
                          {escStatus}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Col>
                <Col xs={24} sm={24}>
                  <div className={styles.commentsHeader}>
                    <h3>Comments</h3>
                    <Button
                      onClick={() => setShowAddCommentsModal(true)}
                      type="primary"
                    >
                      {" "}
                      Add Comment
                    </Button>
                  </div>
                  {issueComments.map((val, idx) => (
                    <Card
                      key={idx}
                      className="comment-card mb-8 border-radius-10"
                    >
                      <p className={styles.comentMsg}>{val.msg}</p>
                      <div className={styles.contentInfo}>
                        <span className={styles.owner}>From: {val.name}</span>
                        <span className={styles.date}>
                          {moment(val.time, "DD-MM-YYYY HH:mm:ss").format(
                            "DD-MM-YYYY"
                          )}
                        </span>
                      </div>
                    </Card>
                  ))}
                </Col>
              </Row>
            </Card>
          ) : null}
        </Col>
        <Col md={4} />
      </Row>
      {showAddCommentsModal ? (
        <AddEscalationCommentsModal
          handleClose={() => setShowAddCommentsModal(false)}
          showModal={showAddCommentsModal}
          currentComments={escalationDetails.comments}
          escalationId={escalationDetails._id as string}
          adminDetails={adminDetails}
          submitCallback={() => getEscatationDetails(escId as string)}
        />
      ) : null}
    </Dashboardlayout>
  );
};

export default FileMemberDetailsPage;
