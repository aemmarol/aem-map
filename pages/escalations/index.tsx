import {Button, message} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {useEffect, useState} from "react";
import {logout, verifyUser} from "../api/v1/authentication";
import {authUser} from "../../types";
import styles from "../../styles/pages/Escalation.module.scss";
import {AddEscalationModal} from "../../components";
import {useGlobalContext} from "../../context/GlobalContext";
const Dashboard: NextPage = () => {
  const router = useRouter();
  const {changeSelectedSidebarKey} = useGlobalContext();
  const [assignedArea, setAssignedArea] = useState<string[]>([]);
  const [showEscalationModal, setShowEscalationModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (typeof verifyUser() !== "string") {
      const {userRole, assignedArea} = verifyUser() as authUser;
      setAssignedArea(assignedArea);
      changeSelectedSidebarKey("2");
      console.log(userRole, assignedArea);
    } else {
      notVerifierUserLogout();
    }
  }, []);

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  const showAddEscalation = () => {
    setShowEscalationModal(true);
  };

  return (
    <Dashboardlayout headerTitle="Escalations">
      {/* {assignedArea.map((val, index) => (
        <div className={styles.escalationWrapper} key={val + index}>
          <div className={styles.escalationHeader}>
            <h3>SECTOR : {val}</h3>
            <Button onClick={showAddEscalation} type="primary" size="large">
              Raise Escalation
            </Button>
          </div>
        </div>
      ))} */}
      {showEscalationModal ? (
        <AddEscalationModal
          handleClose={() => setShowEscalationModal(false)}
          showModal={showEscalationModal}
        />
      ) : null}
    </Dashboardlayout>
  );
};

export default Dashboard;