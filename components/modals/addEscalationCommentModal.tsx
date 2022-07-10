import {Button, Form, Input, message, Modal} from "antd";
import {FC} from "react";

import {authUser, comment} from "../../types";
import moment from "moment";
import {updateEscalationData} from "../../pages/api/v2/services/escalation";

type AddEscalationCommentsModalProps = {
  showModal: boolean;
  handleClose: () => any;
  adminDetails: authUser;
  submitCallback: () => any;
  currentComments: comment[];
  escalationId: string;
};

export const AddEscalationCommentsModal: FC<
  AddEscalationCommentsModalProps
> = ({
  showModal,
  handleClose,
  adminDetails,
  submitCallback,
  currentComments,
  escalationId,
}) => {
  const [form] = Form.useForm();

  const handleEscalationCommentFormSubmit = async (values: any) => {
    const tempComments = [...currentComments];
    const newComment: comment = {
      msg: values.msg,
      name: adminDetails.name,
      contact_number: adminDetails.contact,
      userRole: adminDetails.userRole[0],
      time: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
    };
    tempComments.push(newComment);
    await updateEscalationData(escalationId, {
      comments: newComment,
      updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
    });
    message.success("Comment added!");
    form.resetFields();
    submitCallback();
    handleClose();
  };

  return (
    <Modal
      footer={null}
      onCancel={handleClose}
      visible={showModal}
      title="Add Escalation"
    >
      <Form
        name="escalationComments"
        onFinish={handleEscalationCommentFormSubmit}
        layout="vertical"
        form={form}
      >
        <Form.Item
          label="Comment"
          name="msg"
          className="mb-8"
          rules={[
            {
              required: true,
              message: "Comment cannot be empty!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
