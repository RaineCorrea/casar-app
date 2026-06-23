import { Toaster } from 'sonner';

export default function CustomToastContainer() {
  return (
    <Toaster
      position="top-center"
      duration={3000}
      richColors
      closeButton
      expand
      pauseOnHover
      aria-live="assertive"
      aria-atomic="true"
    />
  );
}
