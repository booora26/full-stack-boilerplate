import { Button, Flex, Space } from "antd";
import { useContext } from "react";
// import { logOut } from "../api/auth";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Spending } from "../components/Spending";
import { BP } from "../components/BP";
import { Campaign } from "../components/Campaign";
import { CLIENT_DEV_URL, CLIENT_PROD_URL, SERVER_DEV_URL, SERVER_PROD_URL } from "../constants";

const serverURL =
process.env.NODE_ENV === 'DEVELOPMENT'
  ? SERVER_DEV_URL
  : SERVER_PROD_URL;
const clientURL =
process.env.NODE_ENV === 'DEVELOPMENT'
  ? CLIENT_DEV_URL
  : CLIENT_PROD_URL;

export default function DashboardPage() {
  const [user] = useContext(AuthContext);

  // const exit = async () => {
  //   const res = await logOut()
  // }

  console.log('serverURL', serverURL)
  console.log('clientURL', clientURL)
  
  const campaignPermission =
    user.permissions && user.permissions.includes("campaign-list");
  const bpPermission =
    user.permissions && user.permissions.includes("view-business-plan");
  const spendingPermission =
    user.permissions && user.permissions.includes("view-spending");

  return (
    <>
      <Space direction="vertical">
        <Space direction="vertical">
          <p>Logged in as: {user.email}</p>
          <p>Provider: {user.provider}</p>
          <p>2FA: {user.isTwoFactorAuthenticationEnabled ? "yes" : "no"}</p>
          {user.provider === "impersonate" ? (
            <p>Original user: {user.originalUser.email}</p>
          ) : (
            ""
          )}
        </Space>

        <Link to={`${clientURL}/users`}>Users</Link>

        <br />
        <Link to={`${serverURL}/auth/logout`}>
          <Button type="primary" danger={user.originalUser}>
            Log Out
          </Button>
        </Link>
      </Space>

      <Flex gap="middle" wrap="wrap" vertical>
        <Flex gap="middle" wrap="wrap">
          {campaignPermission ? <Campaign /> : ""}
          <Flex gap="middle" wrap="wrap" vertical>
            {bpPermission ? <BP /> : ""}
            {spendingPermission ? <Spending /> : ""}
            {spendingPermission ? <Spending /> : ""}
          </Flex>
        </Flex>
        <Flex gap="middle" wrap="wrap">
          {bpPermission ? <BP /> : ""}
          {bpPermission ? <BP /> : ""}
          {bpPermission ? <BP /> : ""}
          {spendingPermission ? <Spending /> : ""}
        </Flex>
      </Flex>
    </>
  );
}
