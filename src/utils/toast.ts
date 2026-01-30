import { toast, type ToastOptions, type TypeOptions } from "react-toastify";

function showToast(
  message: string,
  type: TypeOptions,
  options?: ToastOptions,
) {
  return toast(message, {
    type,
    ...options,
  });
}

export function totastSuccess(message: string, options?: ToastOptions) {
  return showToast(message, "success", options);
}

export function toastError(message: string, options?: ToastOptions) {
  return showToast(message, "error", options);
}
