import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../redux/asyncThunks/authThunks";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((s) => s.auth);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!user && status === "idle") {
        try {
          await dispatch(getUserProfile()).unwrap();
        } catch {
          try {
            // 🔥 THIS is where refresh token belongs
            await dispatch(refreshTokenThunk()).unwrap();
            await dispatch(getUserProfile()).unwrap();
          } catch {
            dispatch(logoutAsyncUser());
          }
        }
      }
    };

    bootstrapAuth();
  }, [user, status, dispatch]);

  return children;
};

export default AuthBootstrap;
