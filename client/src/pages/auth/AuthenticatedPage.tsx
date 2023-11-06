import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../api/auth";

export const AuthenticatedPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useContext(AuthContext);

  useEffect(() => {
    if (!user.id) {
      const fetchCurrentUser = async () => {
        const response = await getCurrentUser();
        response.statusCode !== 403 ? setUser(response) : navigate("/login");

        return user
      };

      fetchCurrentUser();
    }
  }, [navigate, setUser, user]);

  return <>{user.id ? <Outlet /> : ''}</>;
};
