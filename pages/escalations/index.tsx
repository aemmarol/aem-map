import { Button, message, Select } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Dashboardlayout } from "../../layouts/dashboardLayout";
import { useEffect, useState } from "react";
import { logout, verifyUser } from "../api/v1/authentication";
import { authUser } from "../../types";
import styles from "../../styles/pages/Escalation.module.scss";
import { AddEscalationModal } from "../../components";
import { useGlobalContext } from "../../context/GlobalContext";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { changeSelectedSidebarKey } = useGlobalContext();

  const [adminDetails, setAdminDetails] = useState<authUser>({} as authUser);
  const [showEscalationModal, setShowEscalationModal] =
    useState<boolean>(false);
  const [selectedView, setSelectedView] = useState<string>("");

  useEffect(() => {
    if (typeof verifyUser() !== "string") {
      const user: authUser = verifyUser() as authUser
      setAdminDetails(user);
      setSelectedView(user.userRole[0])
      changeSelectedSidebarKey("2");
    } else {
      notVerifierUserLogout();
    }
  }, []);

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  const showAddEscalationModal = () => {
    setShowEscalationModal(true);
  };

  return (
    <Dashboardlayout headerTitle="Escalations">
      <div className="flex-align-center mb-16 ">
        <h4 className="mr-10 mb-0" >Select View : </h4>
        <Select onChange={(e) => setSelectedView(e)} value={selectedView} className="w-150">
          {
            adminDetails.userRole && adminDetails.userRole.map((val) => <Select.Option value={val} key={val} >{val}</Select.Option>)
          }
        </Select>
      </div>

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

      {showEscalationModal ? (
        <AddEscalationModal
          handleClose={() => setShowEscalationModal(false)}
          showModal={showEscalationModal}
          adminDetails={adminDetails}
        />
      ) : null}
    </Dashboardlayout>
  );
};

export default Dashboard;
