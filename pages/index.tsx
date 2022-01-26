import {Button, Layout, Card, Form, Input, Checkbox} from "antd";
import type {NextPage} from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <Layout style={{height: "100vh"}}>
      <Card style={{width: "500", margin: "auto"}}>
        <div style={{textAlign: "center", fontSize: 20}}>
          <b>Sign In</b>
        </div>
        <br />
        <Form
          name="signin"
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          initialValues={{remember: true}}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{required: true, message: "Please input your username!"}]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{required: true, message: "Please input your password!"}]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{offset: 8, span: 16}}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{offset: 8, span: 16}}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default Home;
