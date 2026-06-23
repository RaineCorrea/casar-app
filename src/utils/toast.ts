import { toast } from "sonner";

export function totastSuccess(message: string) {
  return toast.success(message);
}

export function toastError(message: string) {
  return toast.error(message);
}
