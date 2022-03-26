import {Col, Row} from "antd";
import {isEmpty} from "lodash";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useGlobalContext} from "../../../../context/GlobalContext";
import {Dashboardlayout} from "../../../../layouts/dashboardLayout";
import {getFileDataByFileNumber} from "../../../api/v1/db/fileCrud";
import {getMemberListByHofId} from "../../../api/v1/db/memberCrud";
import styles from "../../../../styles/FileList.module.scss";
import {MemberProfileCard} from "../../../../components";
import {MemberListTable} from "../../../../components/tables/memberListTable";

const FileMemberDetailsPage: NextPage = () => {
  const router = useRouter();
  const {fileNumber} = router.query;
  const {toggleLoader} = useGlobalContext();

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
      console.log("fileData", memberDataList);
    } else {
      toggleLoader(false);
      router.push("/");
    }
  };

  useEffect(() => {
    if (fileNumber) {
      getFileDetails(fileNumber);
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
