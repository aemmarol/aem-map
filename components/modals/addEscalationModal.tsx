import {Modal} from "antd";
import {FC} from "react";

type AddEscalationModalProps = {
  showModal: boolean;
  handleClose: () => any;
};

export const AddEscalationModal: FC<AddEscalationModalProps> = ({
  showModal,
  handleClose,
}) => {
  return (
    <Modal
      footer={null}
      onCancel={handleClose}
      visible={showModal}
      title="Add Escalation"
    >
      poll
    </Modal>
  );
};
