import { Button, Space } from "antd";
import useConfig from "antd/es/config-provider/hooks/useConfig";
import { useContext } from "react";
// import { logOut } from "../api/auth";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Spending } from "../components/Spending";
import { BP } from "../components/BP";

export default function DashboardPage() {

  const [user] = useContext(AuthContext)

  // const exit = async () => {
  //   const res = await logOut()
  // }

  return (
    <>
      <Space direction="vertical">
        <Space direction="vertical">
          <p>User: {user.email}</p>
          <p>Provider: {user.provider}</p>
          <p>2FA: {user.isTwoFactorAuthenticationEnabled ? 'yes' : 'no'}</p>
          {user.provider === 'impersonate' ? <p>Original user: {user.originalUser.email}</p> : ''}
        </Space>

        <Link to={'http://localhost:3010/users'}>Users</Link>

        <br />
        <Link to={'http://localhost:4010/auth/logout'}>
        <Button>Log Out</Button>

        </Link>

        {user.permissions && user.permissions.includes('spending') ? <Spending /> : ''}
        {user.permissions && user.permissions.includes('bp') ? <BP /> : ''}

      </Space>


  
    </>
  );
}

