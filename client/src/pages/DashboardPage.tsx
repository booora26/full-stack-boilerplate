import { Button, Col, Flex, Row, Space } from "antd";
import useConfig from "antd/es/config-provider/hooks/useConfig";
import { useContext } from "react";
// import { logOut } from "../api/auth";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Spending } from "../components/Spending";
import { BP } from "../components/BP";
import { Campaign } from "../components/Campaign";

export default function DashboardPage() {
  const [user] = useContext(AuthContext);

  // const exit = async () => {
  //   const res = await logOut()
  // }

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
          <p>User: {user.email}</p>
          <p>Provider: {user.provider}</p>
          <p>2FA: {user.isTwoFactorAuthenticationEnabled ? "yes" : "no"}</p>
          {user.provider === "impersonate" ? (
            <p>Original user: {user.originalUser.email}</p>
          ) : (
            ""
          )}
        </Space>

        <Link to={"http://localhost:3010/users"}>Users</Link>

        <br />
        <Link to={"http://localhost:4010/auth/logout"}>
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
