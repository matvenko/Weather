import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser, setAuthUser } from "./authSlice";
import { useAuthUserMutation } from "./authApiSlice";
import { useEffect } from "react";

const RequireAuth = () => {
  const location = useLocation();
  const [authUser] = useAuthUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    dispatch(logOut());
    navigate("/login");
  };

  const getAuthUserData = () => {
    try {
      const authUserData = authUser().unwrap();
      if (authUserData.type === "success") {
        dispatch(setAuthUser({ user: authUserData }));
      }
    } catch (err) {
      handleLogout();
    }
  };

  const AuthorizedUser = () => {
    const token = window.localStorage.getItem("token");
    const userName = window.localStorage.getItem("userName");
    return token !== null && userName !== null;
  };

  useEffect(() => {
    !AuthorizedUser() && handleLogout();
  }, []);

  return <Outlet />;
};

export default RequireAuth;
