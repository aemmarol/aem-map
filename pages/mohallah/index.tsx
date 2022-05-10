import {Button, message, Tabs} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {MohallahListComponent} from "../../components";
import dynamic from "next/dynamic";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {useEffect, useState} from "react";
import {logout, verifyUser} from "../api/v1/authentication";
import {authUser, sectorData, subSectorData, userRoles} from "../../types";
import {useGlobalContext} from "../../context/GlobalContext";
import {getSectorList} from "../api/v1/db/sectorCrud";
import {getSubSectorList} from "../api/v1/db/subSectorCrud";

const {TabPane} = Tabs;

const Dashboard: NextPage = () => {
  const router = useRouter();
  const {changeSelectedSidebarKey, toggleLoader} = useGlobalContext();

  const [adminPageSectorData, setAdminPageSectorData] = useState<sectorData[]>(
    []
  );
  const [adminPageSubSectorData, setAdminPageSubSectorData] = useState<
    subSectorData[]
  >([]);

  useEffect(() => {
    changeSelectedSidebarKey("1");
    if (typeof verifyUser() !== "string") {
      const {userRole} = verifyUser() as authUser;
      if (!userRole.includes(userRoles.Admin)) {
        notVerifierUserLogout();
      } else {
        getPageData();
      }
    } else {
      notVerifierUserLogout();
    }
  }, []);

  const getPageData = async () => {
    toggleLoader(true);
    const secData = await getSectorList();
    const subSecData = await getSubSectorList();
    setAdminPageSectorData(secData);
    setAdminPageSubSectorData(subSecData);
    toggleLoader(false);
  };

  const notVerifierUserLogout = () => {
    message.info("user does not have access");
    logout();
    router.push("/");
  };

  const redirectToAdminSettings = () => {
    router.push("/admin/settings");
  };
  const Map = dynamic(
    () => import("../../components/maps/map2"), // replace '@components/map' with your component's location
    {ssr: true} // This line is important. It's what prevents server-side render
  );

  return (
    <Dashboardlayout headerTitle="">
      <Tabs
        tabBarExtraContent={
          <Button onClick={redirectToAdminSettings}>Admin Settings</Button>
        }
      >
        <TabPane tab="List View" key="1">
          <MohallahListComponent secData={adminPageSectorData} />
        </TabPane>
        <TabPane tab="Map View" key="2">
          <Map
            secData={adminPageSectorData}
            subSecData={adminPageSubSectorData}
          />
        </TabPane>
      </Tabs>
    </Dashboardlayout>
  );
};

export default Dashboard;
