import type {NextPage} from "next";
import {useState} from "react";
import {SideBar} from "../components/navigation/sidebar";
import {NavBar} from "../components/navigation/navbar";
import {TopicMenu} from "../components/navigation/topicmenu";
import {Layout} from "antd";

const Dashboard: NextPage = () => {
  const topics = ["First topic", "Second topic", "Third topic"];
  const [contentIndex, setContentIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState("0");
  const changeSelectedKey = (event: any) => {
    const key = event.key;
    setSelectedKey(key);
    setContentIndex(+key);
  };
  const Menu = (
    <TopicMenu
      topics={topics}
      selectedKey={selectedKey}
      changeSelectedKey={changeSelectedKey}
    />
  );
  return (
    <div className="App">
      <NavBar menu={Menu} />
      <Layout>
        <SideBar menu={Menu} />
        <Layout.Content className="content">
          {topics[contentIndex]}
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default Dashboard;
