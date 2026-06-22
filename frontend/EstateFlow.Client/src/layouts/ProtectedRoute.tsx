import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-surface p-8">
        <LoadingSkeleton rows={5} />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/panel/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
