import {Card, Row, Col, Button, Popconfirm} from "antd";
import {FC} from "react";
import {useGlobalContext} from "../../../context/GlobalContext";
import {
  getFileDataFields,
  getMumeneenDataFields,
} from "../../../pages/api/v1/db/databaseFields";
import {setDbFields} from "../../../pages/api/v1/db/setupDb";
import {databaseMumeneenFieldData} from "../../../types";

interface CardProps {
  updateMumeneenFieldsData: (data: databaseMumeneenFieldData[]) => any;
  updateFileFieldsData: (data: databaseMumeneenFieldData[]) => any;
}

export const ResetSettingsCard: FC<CardProps> = ({
  updateMumeneenFieldsData,
  updateFileFieldsData,
}) => {
  const {toggleLoader} = useGlobalContext();

  const handleSetDbFields = async () => {
    toggleLoader(true);
    await setDbFields();
    const mumeneenDataFields = await getMumeneenDataFields();
    const fileDataFields = await getFileDataFields();
    updateMumeneenFieldsData(mumeneenDataFields);
    updateFileFieldsData(fileDataFields);
    toggleLoader(false);
  };

  return (
    <Card className="border-radius-10" title="Version Settings">
      <Row>
        <Col xs={24} sm={12}>
          {/* <Popconfirm
            title="Are you sure to reset db fields?"
            onConfirm={handleSetDbFields}
            onCancel={() => {
              console.log("cancel");
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button size="large" shape="round" type="primary">
              Set DB Fields
            </Button>
          </Popconfirm> */}
        </Col>
      </Row>
    </Card>
  );
};
