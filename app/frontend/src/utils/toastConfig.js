import { toast } from "sonner";

let initialized = false;
const shownMessages = new Set();

export const initToastConfig = () => {
  if (initialized) return;
  initialized = true;

  const toastTypes = ['error', 'success', 'warning', 'info', 'loading', 'message'];
  const originalToasts = {};

  // Store original functions
  toastTypes.forEach(type => {
    originalToasts[type] = toast[type];
  });

  // Override each toast type
  toastTypes.forEach(type => {
    toast[type] = (message, opts = {}) => {
      const key = `${type}:${typeof message === 'string' ? message : JSON.stringify(message)}`;
      
      if (shownMessages.has(key)) {
        console.log(`[Toast] Duplicate prevented: ${type} - ${message}`);
        return;
      }
      
      shownMessages.add(key);
      
      originalToasts[type](message, {
        ...opts,
        onDismiss: () => {
          shownMessages.delete(key);
          opts.onDismiss?.();
        },
        onAutoClose: () => {
          shownMessages.delete(key);
          opts.onAutoClose?.();
        }
      });
    };
  });
};

// Optional: Clear all tracked messages (useful for testing)
export const clearToastHistory = () => {
  shownMessages.clear();
};

// Optional: Get current tracked messages count
export const getTrackedMessagesCount = () => {
  return shownMessages.size;
};