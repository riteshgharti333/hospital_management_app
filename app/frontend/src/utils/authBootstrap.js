import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  refreshTokenThunk,
  logoutAsyncUser,
} from "../redux/asyncThunks/authThunks";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();
  const authChecked = useSelector((s) => s.auth.authChecked);

  useEffect(() => {
    if (authChecked) return; // ✅ HARD STOP

    const bootstrapAuth = async () => {
      try {
        // 1️⃣ Try access token
        await dispatch(getUserProfile()).unwrap();
      } catch {
        try {
          // 2️⃣ Try refresh token
          await dispatch(refreshTokenThunk()).unwrap();
          await dispatch(getUserProfile()).unwrap();
        } catch {
          // 3️⃣ Fully logged out
          dispatch(logoutAsyncUser());
        }
      }
    };

    bootstrapAuth();
  }, [authChecked, dispatch]);

  return children;
};

export default AuthBootstrap;
