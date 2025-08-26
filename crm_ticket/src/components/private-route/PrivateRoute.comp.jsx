// PrivateRoute.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { loginSuccess } from "../login/loginSlice";
import { getUserProfile } from "../../pages/dashboard/userAction";
import { fetchNewAccessJWT } from "../../api/userApi";

export const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuth } = useSelector(state => state.login);
  const { user } = useSelector(state => state.user);
  const location = useLocation();

  useEffect(() => {
    const updateAccessJWT = async () => {
      const result = await fetchNewAccessJWT();
      result && dispatch(loginSuccess());
    };

    if (!user._id) dispatch(getUserProfile());

    if (
      !sessionStorage.getItem("accessJWT") &&
      localStorage.getItem("crmSite")
    ) {
      updateAccessJWT();
    }

    if (!isAuth && sessionStorage.getItem("accessJWT")) {
      dispatch(loginSuccess());
    }
  }, [dispatch, isAuth, user._id]);

  if (!isAuth) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};
