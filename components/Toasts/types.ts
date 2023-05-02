export type ToastStatus = 'success' | 'error' | 'warn' | 'info';

export type ToastProps = {
  id?: string;
  text: string;
  timeout?: number;
  status: ToastStatus;
};

export type ToastContextProps = {
  addToast: (toastProps: ToastProps) => void;
  removeToast: (id: string) => void;
  toasts: ToastProps[];
};
