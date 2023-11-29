import React, { useContext, useState } from "react";
import {

  HomeOutlined,
  IdcardOutlined,

} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SERVER_DEV_URL, SERVER_PROD_URL, CLIENT_DEV_URL, CLIENT_PROD_URL } from "../constants";

const serverURL =
process.env.NODE_ENV === 'DEVELOPMENT'
  ? SERVER_DEV_URL
  : SERVER_PROD_URL;
const clientURL =
process.env.NODE_ENV === 'DEVELOPMENT'
  ? CLIENT_DEV_URL
  : CLIENT_PROD_URL;

const { Content, Sider } = Layout;





const items = [
  {
    key: '2',
    icon: <HomeOutlined />,
    label: <Link to={`${clientURL}/`}>Home</Link>,
  },
  {
    key: 1,
    icon: <IdcardOutlined />,
    // permission: 'view-admin',
    children: [
      {
        type: "group", // Must have
        label: "Organization",
        children: [
          {
            key: "1-1",
            // icon: <UserOutlined />,
            label: <Link to={`${clientURL}/users`}>Users</Link>,
          },
        ],
      },
      {
        type: "group", // Must have
        label: "Authorization",
        children: [
          {
            key: "2-1",
            label: "Permissions",

          },
          {
            key: "2-2",
            label: "Roles",
          },
          {
            key: "2-3",
            label: "Groups",
            // permission: 'view-authorization',

          },
        ],
      },
    ],
    label: "Admin",
  },
];


export const RootLayout = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [user] = useContext(AuthContext);

  

  console.log('user', user)

  function filterListByPermissions(list, allowedPermissions) {
    // console.log('a perm', allowedPermissions)
    return list.filter(item => {
      console.log('item', item)
      // Ako trenutni element nema permission ili je dozvoljen
      if (!item.permission || allowedPermissions.includes(item.permission)) {
        console.log('perm', item.permission, 'allowed', allowedPermissions)
        // Ako postoje djeca (children), rekurzivno filtriraj i djecu
        if (item.children && item.children.length > 0) {
          item.children = filterListByPermissions(item.children, allowedPermissions);
        }
        return true;
      } else {
      
        return false;
      }
    });
  }
  const filteredItems = filterListByPermissions(items, user.permissions);
  console.log('filtred', filteredItems)
  // const filteredItems = items.map(elem => {if (elem.children) return  recurseOnSubMenues(elem)})
  // const filteredItems = items.filter((i) => (!i.permission || (user.permissions && user.permissions.includes(i.permission))))
  // const filteredItemsSecondLevel = filteredItems.filter((i) => (!i.permission || (user.permissions && user.permissions.includes(i.permission))))

  return (
    <Layout hasSider>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={filteredItems}
        />
      </Sider>
      <Layout
        className="site-layout"
        style={{ marginLeft: 100, display: "flex" }}
      >
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
            minHeight: "100vh",
          }}
        >
          <div>
            <Outlet />
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  );
};
