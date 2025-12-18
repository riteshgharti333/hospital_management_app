import { useSelector } from "react-redux";

export const useIsLoggedIn = () => {
  const { profile, authChecked } = useSelector((state) => state.auth);

  // ⏳ auth not decided yet
  if (!authChecked) return null;

  // ✅ logged in only if profile exists
  return Boolean(profile);
};
