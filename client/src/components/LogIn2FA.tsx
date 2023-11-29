import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { logIn2FA } from "../api/auth";

export const LogIn2FA = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: unknown) => {
    const res = await logIn2FA(values);
    console.log("2fa res", res);
    if (res.error === 'Unauthorized') {
        messageApi.error('Wrong authentication code')
        return;
    }
    navigate("/");

  };
  return (
    <>
      <Form
        name="twoFA_login"
        autoComplete="off"
        className="login-form"
        initialValues={{ twoFactorAuthenticationCode: "" }}
        onFinish={onFinish}
      >
        <Form.Item name="twoFactorAuthenticationCode" label="Code" rules={[{len: 6}]}>
          <Input autoComplete="off" maxLength={6}></Input>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
      {contextHolder}

    </>
  );
};
