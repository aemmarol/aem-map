import {Col, message, Row} from "antd";
import {isEmpty} from "lodash";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useGlobalContext} from "../../../../context/GlobalContext";
import {Dashboardlayout} from "../../../../layouts/dashboardLayout";
import {getFileDataByFileNumber} from "../../../api/v1/db/fileCrud";
import {getMemberListByHofId} from "../../../api/v1/db/memberCrud";
import styles from "../../../../styles/FileList.module.scss";
import {MemberListTable, MemberProfileCard} from "../../../../components";
import {logout, verifyUser} from "../../../api/v1/authentication";
import {authUser} from "../../../../types";

const FileMemberDetailsPage: NextPage = () => {
  const router = useRouter();
  const {fileNumber, mohallahName, subSectorName} = router.query;
  const {toggleLoader, changeSelectedSidebarKey} = useGlobalContext();

  const [fileDetails, setFileDetails] = useState<any>({});
  const [memberList, setMemberList] = useState<any[]>([]);
  const [fileProfile, setFileProfile] = useState<any[]>([]);

  const getFileDetails = async (fileNumber: any) => {
    toggleLoader(true);
    const filedata = await getFileDataByFileNumber(fileNumber);
    if (!isEmpty(filedata)) {
      setFileDetails(filedata);
      const memberDataList = await getMemberListByHofId(filedata.id);
      setMemberList(memberDataList);
      setFileProfile([
        {label: "HOF Id", value: filedata.id},
        {label: "HOF Name", value: filedata.hof_name},
        {label: "File Number", value: fileNumber},
        {
          label: "No. of family members",
          value: filedata.no_of_females + filedata.no_of_males,
        },

        {label: "Address", value: filedata.address},
      ]);
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

  useEffect(() => {
    if (fileNumber) {
      changeSelectedSidebarKey("1");

      if (typeof verifyUser() !== "string") {
        const {userRole, assignedArea} = verifyUser() as authUser;
        if (
          userRole.includes("Admin") ||
          (userRole.includes("Masool") &&
            assignedArea.includes(mohallahName as string)) ||
          (userRole.includes("Masoola") &&
            assignedArea.includes(mohallahName as string)) ||
          (userRole.includes("Musaid") &&
            assignedArea.includes(subSectorName as string)) ||
          (userRole.includes("Musaida") &&
            assignedArea.includes(subSectorName as string))
        ) {
          getFileDetails(fileNumber);
        } else {
          notVerifierUserLogout();
        }
      } else {
        notVerifierUserLogout();
      }
    }
  }, [fileNumber]);

  return (
    <Dashboardlayout
      backgroundColor={
        (fileDetails && fileDetails?.sub_sector?.sector?.secondary_color) ||
        "#efefef"
      }
      headerTitle={fileNumber?.toString() as string}
    >
      <div className={styles.mainWrapper}>
        <Row className="mb-16" gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, 16]}>
          <Col xs={24} md={12}>
            <MemberProfileCard
              bgColor={
                (fileDetails &&
                  fileDetails?.sub_sector?.sector?.primary_color) ||
                "#efefef"
              }
              fileProfile={fileProfile}
            />
          </Col>
          <Col xs={24}>
            <MemberListTable dataSource={memberList} />
          </Col>
        </Row>
      </div>
    </Dashboardlayout>
  );
};

export default FileMemberDetailsPage;
