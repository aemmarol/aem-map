import {Button, message, Tabs} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {MohallahListComponent} from "../../components";
import dynamic from "next/dynamic";
import {Dashboardlayout} from "../../layouts/dashboardLayout";
import {useEffect} from "react";
import {logout, verifyUser} from "../api/v1/authentication";
import {authUser} from "../../types";
import {useGlobalContext} from "../../context/GlobalContext";

const {TabPane} = Tabs;

const Dashboard: NextPage = () => {
  const router = useRouter();
  const {changeSelectedSidebarKey} = useGlobalContext();

  useEffect(() => {
    // changeSelectedSidebarKey("1");

    if (typeof verifyUser() !== "string") {
      const {userRole} = verifyUser() as authUser;
      if (!userRole.includes("Admin")) {
        notVerifierUserLogout();
      }
    } else {
      notVerifierUserLogout();
    }
  }, []);

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
    {ssr: false} // This line is important. It's what prevents server-side render
  );

  return (
    <Dashboardlayout headerTitle="">
      <Tabs
        tabBarExtraContent={
          <Button onClick={redirectToAdminSettings}>Admin Settings</Button>
        }
      >
        <TabPane tab="List View" key="1">
          <MohallahListComponent />
        </TabPane>
        <TabPane tab="Map View" key="2">
          <Map />
        </TabPane>
      </Tabs>
    </Dashboardlayout>
  );
};

export default Dashboard;
