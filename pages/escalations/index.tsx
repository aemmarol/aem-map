import {Button, message, Select} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {useEffect, useState} from "react";
import {logout, verifyUser} from "../api/v1/authentication";
import {authUser, escalationData} from "../../types";
// import styles from "../../styles/pages/Escalation.module.scss";
import {AddEscalationModal, MusaidEscalationList} from "../../components";
import {useGlobalContext} from "../../context/GlobalContext";
import {getEscalationListBySubSector} from "../api/v1/db/escalationsCrud";
import moment from "moment";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const {changeSelectedSidebarKey} = useGlobalContext();

  const [adminDetails, setAdminDetails] = useState<authUser>({} as authUser);
  const [showEscalationModal, setShowEscalationModal] =
    useState<boolean>(false);
  const [selectedView, setSelectedView] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [escalationList, setEscalationList] = useState<escalationData[]>([]);

  useEffect(() => {
    if (typeof verifyUser() !== "string") {
      const user: authUser = verifyUser() as authUser;
      setAdminDetails(user);
      setSelectedView(user.userRole[0]);
      setSelectedRegion(user.assignedArea[0]);
      changeSelectedSidebarKey("2");
    } else {
      notVerifierUserLogout();
    }
  }, []);

  useEffect(() => {
    if (selectedRegion !== "") {
      getEscalationList();
    }
  }, [selectedRegion]);

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  const showAddEscalationModal = () => {
    setShowEscalationModal(true);
  };

  const getEscalationList = async () => {
    const escList: escalationData[] = await getEscalationListBySubSector(
      selectedRegion
    );
    setEscalationList(
      escList.sort((a, b) =>
        moment(a.updated_at, "DD-MM-YYYY HH:mm:ss").diff(
          moment(b.updated_at, "DD-MM-YYYY HH:mm:ss")
        )
      )
    );
    console.log("list", escList);
  };

  return (
    <Dashboardlayout headerTitle="Escalations">
      {adminDetails &&
      adminDetails.userRole &&
      adminDetails.userRole.length > 1 ? (
        <div className="flex-align-center mb-16 ">
          <h4 className="mr-10 mb-0">Select View : </h4>
          <Select
            onChange={(e) => setSelectedView(e)}
            value={selectedView}
            className="w-150"
          >
            {adminDetails.userRole &&
              adminDetails.userRole.map((val) => (
                <Select.Option value={val} key={val}>
                  {val}
                </Select.Option>
              ))}
          </Select>
        </div>
      ) : null}

      {selectedView === "Umoor" ? null : (
        <div className="d-flex mb-30">
          <Button
            className="ml-auto"
            onClick={showAddEscalationModal}
            type="primary"
            size="large"
          >
            Raise Escalation
          </Button>
        </div>
      )}

      <MusaidEscalationList
        region={selectedRegion}
        escalationlist={escalationList}
      />

      {showEscalationModal ? (
        <AddEscalationModal
          handleClose={() => setShowEscalationModal(false)}
          showModal={showEscalationModal}
          adminDetails={adminDetails as authUser}
        />
      ) : null}
    </Dashboardlayout>
  );
};

export default Dashboard;
