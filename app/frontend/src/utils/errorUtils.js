export const getErrorMessage = (error) => {
  if (typeof error === "string") return error;

  if (error?.request && !error?.response) {
    return "Network error: Please check your internet connection.";
  }

  if (error?.response?.status >= 500) {
    return "Server error: Please try again later.";
  }

  const msg = error?.response?.data?.message || error?.message;

  if (Array.isArray(msg)) {
    return msg.join(", ");
  }

  return msg || "An unknown error occurred";
};
