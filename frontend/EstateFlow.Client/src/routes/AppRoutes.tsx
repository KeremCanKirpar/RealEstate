import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { ProtectedRoute } from "../layouts/ProtectedRoute";
import { PublicLayout } from "../layouts/PublicLayout";
import { AddCustomerPage } from "../pages/AddCustomerPage";
import { AddPropertyPage } from "../pages/AddPropertyPage";
import { AppointmentsPage } from "../pages/AppointmentsPage";
import { CustomerDetailPage } from "../pages/CustomerDetailPage";
import { CustomersPage } from "../pages/CustomersPage";
import { DashboardPage } from "../pages/DashboardPage";
import { DocumentsPage } from "../pages/DocumentsPage";
import { EditPropertyPage } from "../pages/EditPropertyPage";
import { LoginPage } from "../pages/LoginPage";
import { PropertyDetailPage } from "../pages/PropertyDetailPage";
import { PropertiesPage } from "../pages/PropertiesPage";
import { PublicHomePage } from "../pages/PublicHomePage";
import { PublicLeadPage } from "../pages/PublicLeadPage";
import { PublicPropertiesPage } from "../pages/PublicPropertiesPage";
import { PublicPropertyDetailPage } from "../pages/PublicPropertyDetailPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ReportsPage } from "../pages/ReportsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { TasksPage } from "../pages/TasksPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/musteri" replace />} />
      <Route path="/musteri" element={<PublicLayout />}>
        <Route index element={<PublicHomePage />} />
        <Route path="ilanlar" element={<PublicPropertiesPage />} />
        <Route path="ilanlar/:id" element={<PublicPropertyDetailPage />} />
        <Route path="talep" element={<PublicLeadPage />} />
      </Route>

      <Route path="/panel/login" element={<LoginPage />} />
      <Route path="/panel/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/panel" element={<MainLayout />}>
          <Route index element={<Navigate to="/panel/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/new" element={<AddPropertyPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
          <Route path="properties/:id/edit" element={<EditPropertyPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/new" element={<AddCustomerPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/login" element={<Navigate to="/panel/login" replace />} />
      <Route path="/register" element={<Navigate to="/panel/register" replace />} />
      <Route path="/dashboard" element={<Navigate to="/panel/dashboard" replace />} />
      <Route path="/properties" element={<Navigate to="/panel/properties" replace />} />
      <Route path="/properties/new" element={<Navigate to="/panel/properties/new" replace />} />
      <Route path="/properties/:id" element={<LegacyIdRedirect prefix="/panel/properties" />} />
      <Route path="/properties/:id/edit" element={<LegacyIdRedirect prefix="/panel/properties" suffix="/edit" />} />
      <Route path="/customers" element={<Navigate to="/panel/customers" replace />} />
      <Route path="/customers/new" element={<Navigate to="/panel/customers/new" replace />} />
      <Route path="/customers/:id" element={<LegacyIdRedirect prefix="/panel/customers" />} />
      <Route path="/appointments" element={<Navigate to="/panel/appointments" replace />} />
      <Route path="/tasks" element={<Navigate to="/panel/tasks" replace />} />
      <Route path="/documents" element={<Navigate to="/panel/documents" replace />} />
      <Route path="/reports" element={<Navigate to="/panel/reports" replace />} />
      <Route path="/settings" element={<Navigate to="/panel/settings" replace />} />
      <Route path="/ilanlar" element={<Navigate to="/musteri/ilanlar" replace />} />
      <Route path="/ilanlar/:id" element={<LegacyIdRedirect prefix="/musteri/ilanlar" />} />
      <Route path="/talep" element={<Navigate to="/musteri/talep" replace />} />
      <Route path="*" element={<Navigate to="/musteri" replace />} />
    </Routes>
  );
}

function LegacyIdRedirect({ prefix, suffix = "" }: { prefix: string; suffix?: string }) {
  const { id } = useParams();
  return <Navigate to={`${prefix}/${id}${suffix}`} replace />;
}