import {Button, Layout, Card, Form, Input, Checkbox} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import type {NextPage} from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <div className={styles.mainWrapper}>
      <Card className={styles.signInBox}>
        <div className={styles.signInHeader}>
          <h1>Sign In</h1>
        </div>
        <Form
          name="signInForm"
          initialValues={{remember: true}}
          className={styles.signInForm}
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

          <Form.Item className={styles.logInButton}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.logInButton}
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
