import { useAuth } from "../hooks/useAuth";
import { ScreenShare } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

export function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
