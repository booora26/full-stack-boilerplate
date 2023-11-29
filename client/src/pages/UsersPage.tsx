import { getUsers } from "../api/users";
import { Outlet, useLoaderData } from "react-router-dom";
import { Col, Row } from "antd";
import { UserList } from "../components/UserList";

export const UsersPage = () => {
  const { users } = useLoaderData();

  console.log(users);
  return (
    <>
      <Row>
        <Col span={8}>
          <UserList users={users} />
        </Col>
        <Col span={16}>
          <Outlet context={users} />
        </Col>
      </Row>
    </>
  );
};

export const loader = async () => {
  const users = await getUsers();
  return { users };
};
