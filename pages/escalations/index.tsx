import { Button, message, Select } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Dashboardlayout } from "../../layouts/dashboardLayout";
import { useEffect, useState } from "react";
import { logout, verifyUser } from "../api/v1/authentication";
import { authUser, userRoles } from "../../types";
import { AddEscalationModal } from "../../components";
import { useGlobalContext } from "../../context/GlobalContext";
import { EscalationList } from "../../components/custom/escalations/escalationList";
import { getSectorList } from "../api/v1/db/sectorCrud";
import { getUmoorList } from "../api/v1/db/umoorsCrud";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { changeSelectedSidebarKey } = useGlobalContext();

  const [adminDetails, setAdminDetails] = useState<authUser>({} as authUser);
  const [showEscalationModal, setShowEscalationModal] =
    useState<boolean>(false);
  const [selectedView, setSelectedView] = useState<userRoles>();

  useEffect(() => {
    if (typeof verifyUser() !== "string") {
      const user: authUser = verifyUser() as authUser;
      setUserDetails(user);
      changeSelectedSidebarKey("2");
    } else {
      notVerifierUserLogout();
    }
  }, []);

  const setUserDetails = async (user: authUser) => {
    if (user.userRole[0].includes(userRoles.Admin)) {
      const sectors = await getSectorList();
      user.assignedArea = sectors.map((sector) => sector.name);
      const umoors = await getUmoorList();
      user.assignedUmoor = umoors.map((umoor: any) => umoor.value);
    }
    setAdminDetails(user);
    setSelectedView(user.userRole[0]);
    // console.log(user);
  };

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
      <div className="d-flex mb-16">

        {adminDetails &&
          adminDetails.userRole &&
          adminDetails.userRole.length > 1 ? (
          <div className="flex-align-center flex-1">
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
          <div className="d-flex w-full float-right">
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

      </div>




      {selectedView && adminDetails ? (
        <EscalationList user={adminDetails} userRole={selectedView} />
      ) : null}

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
