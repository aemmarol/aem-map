import {Button, Form, Input} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import type {NextPage} from "next";
import styles from "../styles/Home.module.scss";
import {Signinlayout} from "../layouts/signInPage";
import {SigninCard} from "../components";
import {login} from "../pages/api/v1/authentication";

const SignInPage: NextPage = () => {
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Signinlayout>
      <SigninCard title="Sign In">
        <Form
          name="signinForm"
          initialValues={{remember: true}}
          className={styles.signinForm}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="ITSID"
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
