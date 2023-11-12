import { UserOutlined } from "@ant-design/icons";
import { Avatar, Col, Row, Typography } from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const UsersListItem = (props) => {
  const [user] = useContext(AuthContext);

  const { email, id, image } = props;
  return (
    <>
      <div className="campaign-list-item">
        <Row style={{ minHeight: "50px" }}>
          <Col
            span={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar icon={<UserOutlined />} src={image} size="large" />
          </Col>
          <Col style={{ marginLeft: "10px" }}>
            <Row>
              <Link to={`http://localhost:3010/users/${id}`}><Typography.Title level={5} style={{ margin: "5px" }}>
                {email}
              </Typography.Title></Link>
            </Row>
            <Row>
              {user.permissions && user.permissions.includes("switch-user") ? (
                <Link
                  to={`http://localhost:4010/users/${id}/impersonate`}
                  style={{ margin: "5px" }}
                >
                  Switch
                </Link>
              ) : (
                ""
              )}
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};
