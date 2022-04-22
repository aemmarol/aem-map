import {Card} from "antd";
import {FC} from "react";

interface CardProps {
  cardTitle: string;
  TableComponent: any;
  tableComponentProps: any;
  extraComponents: any;
}

export const TableCardWithForm: FC<CardProps> = ({
  cardTitle,
  tableComponentProps,
  TableComponent,
  extraComponents,
}) => {
  return (
    <Card
      className="border-radius-10"
      extra={extraComponents}
      title={cardTitle}
    >
      <TableComponent {...tableComponentProps} />
    </Card>
  );
};
