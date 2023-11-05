import { Button, Space } from "antd";
import useConfig from "antd/es/config-provider/hooks/useConfig";
import { useContext } from "react";
// import { logOut } from "../api/auth";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function DashboardPage() {

  const [user] = useContext(AuthContext)

  const exit = async () => {
    const res = await logOut()
  }

  return (
    <>
      <Space direction="vertical">
        <Space direction="vertical">
          <p>User: {user.email}</p>
          <p>Provider: {user.provider}</p>
          <p>2FA: {user.isTwoFactorAuthenticationEnabled ? 'yes' : 'no'}</p>
          {user.provider === 'impersonate' ? <p>Original user: {user.originalUser.email}</p> : ''}
        </Space>

        <a href="http://localhost:4010/users/16/impersonate">Impersonate</a>
        <br />
        <Link to={'http://localhost:4010/auth/logout'}>
        <Button>Log Out</Button>

        </Link>

      </Space>
  
    </>
  );
}

