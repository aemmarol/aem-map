import {Card, Col, Row} from "antd";
import {FC} from "react";
import styles from "../../../styles/components/cards/profileCard.module.scss";

interface ProfileCardProps {
  bgColor: string;
  fileProfile: any[];
}

export const MemberProfileCard: FC<ProfileCardProps> = ({
  bgColor,
  fileProfile,
}) => {
  return (
    <Card
      headStyle={{
        backgroundColor: bgColor,
        color: "#ffffff",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        fontSize: "24px",
        fontWeight: 600,
      }}
      title="Family Profile"
      className="border-radius-10"
    >
      <Row gutter={[{xs: 8, sm: 8, md: 8, lg: 8}, 8]}>
        {fileProfile.map((value, index) => (
          <Col
            key={index}
            xs={24}
            sm={index < fileProfile.length - 1 ? 12 : 24}
          >
            <div className={styles.infoWrapper}>
              <p className={styles.label}>{value.label}</p>
              <p className={styles.value}>{value.value}</p>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};
