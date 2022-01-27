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
        <div className={styles.signinheader}>
          <h1>Sign In</h1>
        </div>
        <Form name="signin_form" initialValues={{remember: true}}>
          <Form.Item
            name="Username"
            rules={[{required: true, message: "Please input your Username!"}]}
          >
            <Input
              prefix={<UserOutlined className={styles.formicon} />}
              placeholder= "Username"
              bordered={false}
              className={styles.forminput}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{required: true, message: "Please input your Password!"}]}
          >
            <Input
              prefix={<LockOutlined className={styles.formicon} />}
              type="password"
              placeholder="Password"
              bordered={false}
              className={styles.forminput}
            />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className={styles.remembercheck}>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginbutton}
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
