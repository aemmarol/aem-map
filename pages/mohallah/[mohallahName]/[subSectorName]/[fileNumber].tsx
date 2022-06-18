import {Col, message, Row} from "antd";
import {isEmpty} from "lodash";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useGlobalContext} from "../../../../context/GlobalContext";
import {Dashboardlayout} from "../../../../layouts/dashboardLayout";
import styles from "../../../../styles/FileList.module.scss";
import {MemberListTable, MemberProfileCard} from "../../../../components";
import {logout, verifyUser} from "../../../api/v1/authentication";
import {authUser, userRoles} from "../../../../types";
import {getFileDataByFileNumber} from "../../../api/v2/services/file";
import {getMemberListByHofId} from "../../../api/v2/services/member";

const FileMemberDetailsPage: NextPage = () => {
  const router = useRouter();
  const {fileNumber, mohallahName, subSectorName} = router.query;
  const {toggleLoader, changeSelectedSidebarKey} = useGlobalContext();

  const [fileDetails, setFileDetails] = useState<any>({});
  const [memberList, setMemberList] = useState<any[]>([]);
  const [fileProfile, setFileProfile] = useState<any[]>([]);

  const getFileDetails = async (fileNumber: any) => {
    toggleLoader(true);
    let filedata: any = {};
    await getFileDataByFileNumber(fileNumber, (data: any) => {
      filedata = data;
    });
    if (!isEmpty(filedata)) {
      setFileDetails(filedata);
      await getMemberListByHofId(filedata._id, (data: any) => {
        setMemberList(data);
      });
      setFileProfile([
        {label: "HOF Id", value: filedata._id},
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
          userRole.includes(userRoles.Admin) ||
          (userRole.includes(userRoles.Masool) &&
            assignedArea.includes(mohallahName as string)) ||
          (userRole.includes(userRoles.Masoola) &&
            assignedArea.includes(mohallahName as string)) ||
          (userRole.includes(userRoles.Musaid) &&
            assignedArea.includes(subSectorName as string)) ||
          (userRole.includes(userRoles.Musaida) &&
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
      showBackButton={true}
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
