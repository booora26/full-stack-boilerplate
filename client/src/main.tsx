import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import { LogInPage } from "./pages/auth/LogInPage";
import { RegistrationPage } from "./pages/auth/RegistrationPage";
import { TwoFAPage } from "./pages/auth/TwoFAPage";
import {
  MainContext,
  UserContext,
  unAuthenticatedUser,
} from "./context/AuthContext.tsx";
import { AuthenticatedPage } from "./pages/auth/AuthenticatedPage.tsx";
import { UsersPage, loader as usersLoader } from "./pages/UsersPage.tsx";
import { ResetPassword } from "./components/ResetPassword.tsx";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage.tsx";
import './assets/main.css'
import { RootLayout } from "./layout/RootLayout.tsx";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <LogInPage />,
  },
  {
    path: "/registration",
    element: <RegistrationPage />,
  },
  {
    path: "/2fa",
    element: <TwoFAPage />,
  },
  {
  element: <RootLayout />,
  children: 
  [{
    element: <AuthenticatedPage />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/users",
        element: <UsersPage />,
        loader: usersLoader
      },
    ],
  }]},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#e9c46a",
          borderRadius: 3,
        },
      }}
    >
      <UserContext>
        <RouterProvider router={router} />
      </UserContext>
    </ConfigProvider>
  </React.StrictMode>
);
