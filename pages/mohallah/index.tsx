import {Button, Tabs} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {MohallahListComponent} from "../../components";
import {Map1} from "../../components/maps";
import {Dashboardlayout} from "../../layouts/dashboardLayout";

const {TabPane} = Tabs;

const Dashboard: NextPage = () => {
  const router = useRouter();
  const redirectToAdminSettings = () => {
    router.push("/admin/settings");
  };

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
          <Map1 />
        </TabPane>
      </Tabs>
    </Dashboardlayout>
  );
};

export default Dashboard;
