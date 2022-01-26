import {Button, Layout, Card, Form, Input, Checkbox} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import type {NextPage} from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <div className={styles.main_wrapper}>
      <Card className={styles.signinbox}>
        <div className={styles.loginheader}>Sign In</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{remember: true}}
        >
          <Form.Item
            name="username"
            rules={[{required: true, message: "Please input your Username!"}]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{required: true, message: "Please input your Password!"}]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Home;
