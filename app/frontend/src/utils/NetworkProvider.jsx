import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * NetworkProvider
 * - Detects internet connectivity
 * - Shows global offline toast
 * - Optionally shows top banner
 */
const NetworkProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Please check your internet connection", {
        id: "network-status",
      });
    };

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back online", {
        id: "network-status",
      });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "#dc2626",
            color: "#fff",
            textAlign: "center",
            padding: "6px",
            fontSize: "14px",
          }}
        >
          You are offline. Please check your internet connection.
        </div>
      )}

      {children}
    </>
  );
};

export default NetworkProvider;
