import React from "react";
import {Menu} from "antd";

export const TopicMenu = ({topics, selectedKey, changeSelectedKey}: any) => {
  const styledTopics: any = [];
  topics.forEach((topic: any, index: any) =>
    styledTopics.push(
      <Menu.Item key={index} onClick={changeSelectedKey}>
        {topic}
      </Menu.Item>
    )
  );

  return (
    <Menu mode="inline" selectedKeys={[selectedKey]}>
      {styledTopics}
    </Menu>
  );
};
