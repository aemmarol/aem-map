import { Button, Card, Col, Divider, message, Row, Select } from "antd";
import { isEmpty } from "lodash";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EscStat } from "../../components/custom/escalations/escalationStatus";
import { useGlobalContext } from "../../context/GlobalContext";
import { Dashboardlayout } from "../../layouts/dashboardLayout";
import { authUser, comment, escalationData, userRoles } from "../../types";
import { logout, verifyUser } from "../api/v1/authentication";
import { getEscalationData } from "../api/v1/db/escalationsCrud";
import moment from "moment";
import Airtable from "airtable";
import styles from "../../styles/pages/Escalation.module.scss";
import { escalationIssueStatusList } from "../../utils";

const airtableBase = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("app7V1cg4ibiooxcn");

const umoorTable = airtableBase("umoorList");

const FileMemberDetailsPage: NextPage = () => {
    const router = useRouter();
    const { escId } = router.query;
    const { toggleLoader, changeSelectedSidebarKey } = useGlobalContext();

    const [escalationDetails, setEscalationDetails] = useState<escalationData>(
        {} as escalationData
    );
    const [adminDetails, setAdminDetails] = useState<authUser>({} as authUser);
    const [issueTypeOptions, setIssueTypeOptions] = useState<any[]>([]);
    const [selectIssueValue, setselectIssueValue] = useState<string>("");
    const [selectStatusValue, setSelectStatusValue] = useState<string>("");
    const [issueComments, setIssueComments] = useState<comment[]>([]);

    useEffect(() => {
        if (escId) {
            changeSelectedSidebarKey("2");
            if (typeof verifyUser() !== "string") {
                const user = verifyUser() as authUser;
                const { userRole } = user;
                if (
                    userRole.includes(userRoles.Admin) ||
                    userRole.includes(userRoles.Umoor)
                ) {
                    getEscatationDetails(escId as string);
                    setAdminDetails(user);
                    getUmoorList();
                } else {
                    notVerifierUserLogout();
                }
            } else {
                notVerifierUserLogout();
            }
        }
    }, [escId]);

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

    const getEscatationDetails = async (id: string) => {
        toggleLoader(true);
        const escData = await getEscalationData(id);
        if (!isEmpty(escData)) {
            setEscalationDetails(escData);
            setselectIssueValue(getIssueType(escData.type, "value"));
            setSelectStatusValue(escData.status);
            setIssueComments(escData.comments)
            toggleLoader(false);
        } else {
            toggleLoader(false);
            router.push("/");
        }
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
        setselectIssueValue(val);
    };

    const handleSelectStatusChange = async (val: string) => {
        setSelectStatusValue(val);
    };
    handleSelectStatusChange;

    return (
        <Dashboardlayout
            backgroundColor="#efefef"
            headerTitle={
                escalationDetails && escalationDetails.escalation_id
                    ? escalationDetails.escalation_id
                    : ""
            }
        >
            <Row className="mb-16" gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 16]}>
                <Col md={4} />
                <Col xs={24} md={16}>
                    {!isEmpty(escalationDetails) ? (
                        <Card className="border-radius-10">
                            <h2 className="mb-30">{escalationDetails.issue}</h2>
                            <Row gutter={[8, 8]}>
                                <Col xs={16}>
                                    <EscStat
                                        label="HOF Name"
                                        value={escalationDetails.file_details.hof_name}
                                    />
                                </Col>
                                <Col xs={8}>
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
                                <Col xs={8}>
                                    <EscStat
                                        label="HOF Contact number"
                                        value={escalationDetails.file_details.hof_contact}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <EscStat
                                        label="HOF ITS"
                                        value={escalationDetails.file_details.hof_its}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <EscStat
                                        label="File No"
                                        value={
                                            escalationDetails.file_details.tanzeem_file_no as string
                                        }
                                    />
                                </Col>

                                <Col xs={24}>
                                    <EscStat
                                        label="Address"
                                        value={escalationDetails.file_details.address}
                                    />
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={[16, 16]}>
                                <Col xs={8}>
                                    <EscStat
                                        label="Reported On"
                                        value={moment(
                                            escalationDetails.created_at,
                                            "DD-MM-YYYY HH:mm:ss"
                                        ).format("DD-MM-YYYY")}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <EscStat
                                        label="Reported by"
                                        value={escalationDetails.created_by.name}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <EscStat
                                        label="Reported by Contact"
                                        value={escalationDetails.created_by.contact_number}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <EscStat
                                        label="Mohallah"
                                        value={
                                            escalationDetails.file_details.sub_sector.sector
                                                ?.name as string
                                        }
                                        type="tag"
                                        tagColor={
                                            escalationDetails.file_details.sub_sector.sector
                                                ?.primary_color as string
                                        }
                                    />
                                </Col>
                                <Col xs={8}>
                                    <EscStat
                                        label="SubSector"
                                        value={
                                            escalationDetails.file_details.sub_sector.name as string
                                        }
                                    />
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={[16, 8]}>
                                <Col xs={12}>
                                    <p className={styles.escStatLabel}>Status</p>
                                    <Select
                                        onChange={handleSelectStatusChange}
                                        value={selectStatusValue}
                                        className="width-200"
                                    >
                                        {escalationIssueStatusList
                                            .filter((val) => val.value !== "Closed")
                                            .map((val: any) => (
                                                <Select.Option
                                                    label={val.value}
                                                    value={val.value}
                                                    key={val.value}
                                                >
                                                    {val.value}
                                                </Select.Option>
                                            ))}
                                    </Select>
                                </Col>
                                <Col xs={24}>
                                    <div className={styles.commentsHeader}>
                                        <h3>Comments</h3>
                                        <Button type="primary"> Add Comment</Button>
                                    </div>
                                    {
                                        issueComments.map(val => (
                                            <Card className="comment-card mb-8 border-radius-10" >
                                                <p className={styles.comentMsg}>
                                                    {val.msg}
                                                </p>
                                                <div className={styles.contentInfo} >
                                                    <span className={styles.owner} >From: {val.name}</span>
                                                    <span className={styles.date}>{moment(val.time,"DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY")}</span>
                                                </div>
                                            </Card>
                                        ))
                                    }
                                </Col>
                            </Row>

                        </Card>
                    ) : null}
                </Col>
                <Col md={4} />
            </Row>
        </Dashboardlayout>
    );
};

export default FileMemberDetailsPage;
