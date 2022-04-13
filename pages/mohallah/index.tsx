import {Button, Tabs} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {MohallahListComponent} from "../../components";
// import {Map1} from "../../components/maps";
import dynamic from "next/dynamic";
import {Dashboardlayout} from "../../layouts/dashboardLayout";

const {TabPane} = Tabs;

const Dashboard: NextPage = () => {
  const router = useRouter();
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
