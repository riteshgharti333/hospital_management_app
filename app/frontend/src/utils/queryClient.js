import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "./errorUtils";

const onError = (error) => {
  console.log("🔥 Global query error", error);
  toast.error(getErrorMessage(error));
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      onError,
    },
    mutations: {
      retry: 0,
      onError,
    },
  },
});

export default queryClient;