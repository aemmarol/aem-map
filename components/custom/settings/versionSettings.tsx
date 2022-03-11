import {Card, Form, Table} from "antd";
import {FC} from "react";

export const VersionSettingsCard: FC = () => {
  const [form] = Form.useForm();

  return (
    <Card className="border-radius-10" title="Version Settings">
      <Form form={form} component={false}>
        <Table
          // loading={isLoading}
          dataSource={[]}
          columns={[]}
          scroll={{y: "400px"}}
          pagination={false}
        />
      </Form>
    </Card>
  );
};
