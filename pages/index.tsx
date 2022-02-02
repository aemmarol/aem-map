import {Button, Form, Input} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import type {NextPage} from "next";
import styles from "../styles/Home.module.scss";
import {Signinlayout} from "../layouts/signInPage";
import {SigninCard} from "../components";

const SignInPage: NextPage = () => {
  return (
    <Signinlayout>
      <SigninCard title="Sign In">
        <Form
          name="signinForm"
          initialValues={{remember: true}}
          className={styles.signinForm}
        >
          <Form.Item
            name="username"
            rules={[{required: true, message: "Please input your Username!"}]}
          >
            <Input
              prefix={<UserOutlined className={styles.formIcon} />}
              placeholder="Username"
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
