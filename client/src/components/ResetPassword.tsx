import { message, Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import {  resetPassword } from '../api/auth';

export const ResetPassword = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
  
    const onFinish = async (values: unknown) => {
      const res = await resetPassword(values);
      console.log("reset password", res);
      if (res.error) {
          messageApi.error('Wrong password')
          return;
      }
      navigate("/login");
  
    };
    return (
      <>
        <Form
         labelCol={{ span: 8 }}
          name="reset_password"
          autoComplete="off"
          className="login-form"
        //   initialValues={{ twoFactorAuthenticationCode: "" }}
          onFinish={onFinish}
        >
          <Form.Item name="password" label="Current Password">
            <Input autoComplete="off" maxLength={6}></Input>
          </Form.Item>
          <Form.Item name="newPassword1" label="New Password">
            <Input autoComplete="off" ></Input>
          </Form.Item>
          <Form.Item name="newPassword2" label="Repeat New Password">
            <Input autoComplete="off"></Input>
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
}
