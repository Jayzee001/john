import { toast } from 'sonner';

export const toastUtils = {
  // Success notifications
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  },

  // Error notifications
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
    });
  },

  // Info notifications
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 3000,
    });
  },

  // Warning notifications
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  },

  // Loading notifications
  loading: (message: string) => {
    return toast.loading(message);
  },

  // Dismiss a specific toast
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },
};

// Auth-specific toast helpers
export const authToast = {
  loginSuccess: () => {
    toastUtils.success('Login successful', 'Welcome back!');
  },

  loginError: (error: string) => {
    toastUtils.error('Login failed', error);
  },

  signupSuccess: () => {
    toastUtils.success('Account created successfully', 'Welcome to John Store!');
  },

  signupError: (error: string) => {
    toastUtils.error('Signup failed', error);
  },

  logoutSuccess: () => {
    toastUtils.info('Logged out successfully', 'Come back soon!');
  },

  logoutError: (error: string) => {
    toastUtils.error('Logout failed', error);
  },

  profileUpdated: () => {
    toastUtils.success('Profile updated successfully');
  },

  profileError: (error: string) => {
    toastUtils.error('Profile update failed', error);
  },
}; 