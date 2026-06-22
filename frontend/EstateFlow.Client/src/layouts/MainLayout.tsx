import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar />
      <div className="lg:pl-[280px]">
        <TopNavbar />
        <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
