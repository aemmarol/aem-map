import {Button, Form, Input, notification} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import type {NextPage} from "next";
import styles from "../styles/SignInPage.module.scss";
import {Signinlayout} from "../layouts/signInLayout";
import {SigninCard} from "../components";
import {login} from "../pages/api/v1/authentication";
import {authenticationProps, loginResponseData} from "../types";

const SignInPage: NextPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values: authenticationProps) => {
    login(values)
      .then((response) => {
        const userResponse: loginResponseData = response as loginResponseData;
        notification.success({
          message: userResponse.msg,
        });
        form.resetFields();
      })
      .catch((error) => {
        notification.error({
          message: error.message,
        });
      });
  };

  return (
    <Signinlayout>
      <SigninCard title="Sign In">
        <Form
          form={form}
          name="signinForm"
          initialValues={{remember: true}}
          className={styles.signinForm}
          onFinish={onFinish}
        >
          <Form.Item
            name="itsId"
            rules={[
              {required: true, message: "Please input your ITS ID!"},
              {min: 8, message: "ITS ID cannot be less than 8 characters"},
              {max: 8, message: "ITS ID cannot be greater than 8 characters"},
              {
                pattern: new RegExp(/^[0-9]+$/),
                message: "ITS ID should be a number",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className={styles.formIcon} />}
              placeholder="ITS ID"
              bordered={false}
              className={styles.formInput}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{required: true, message: "Please input your Password!"}]}
          >
            <Input
              prefix={<LockOutlined className={styles.formIcon} />}
              type="password"
              placeholder="Password"
              bordered={false}
              className={styles.formInput}
            />
          </Form.Item>

          <Form.Item className="text-align-center">
            <Button
              type="primary"
              htmlType="submit"
              className={styles.signInButton}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </SigninCard>
    </Signinlayout>
  );
};

export default SignInPage;
