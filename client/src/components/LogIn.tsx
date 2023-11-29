import { Button, Checkbox, Form, Input, Typography } from "antd";
import {
  GithubOutlined,
  GoogleOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {  logIn } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_DEV_URL, SERVER_PROD_URL } from "../constants";

const serverURL =
process.env.NODE_ENV === 'DEVELOPMENT'
  ? SERVER_DEV_URL
  : SERVER_PROD_URL;

export const LogIn = () => {
  const navigate = useNavigate();
  // const [user, setUser] = useContext(AuthContext)

  const onFinish = async (values: unknown) => {
    const res = await logIn(values);
    if (!res) {

    return;

    }
    console.log('login res', res)

    navigate("/");

  };
  return (
    <>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true, email: 'vasa@um.com', password: '123' }}
        onFinish={onFinish}
      >
        <Form.Item>
          <Typography.Title level={3}> LOG IN </Typography.Title>
        </Form.Item>
        <Form.Item>
          <Link to={`${serverURL}/auth/google`}>
            <Button
              className="login-form-button"
              block
              icon={<GoogleOutlined />}
            >
              Log in with Google
            </Button>
          </Link>
        </Form.Item>
        <Form.Item>
          <Link to={`${serverURL}/auth/github`}>
            <Button
              className="login-form-button"
              block
              icon={<GithubOutlined />}
            >
              Log in with GitHub
            </Button>
          </Link>
        </Form.Item>
        <Form.Item>
          <Typography.Title level={4}> OR </Typography.Title>
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
          >
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    </>
  );
};
