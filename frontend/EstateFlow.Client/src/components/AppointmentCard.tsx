import { CalendarClock, MapPin } from "lucide-react";
import type { Appointment } from "../types";
import { appointmentStatusLabel, appointmentTypeLabel, dateTime } from "../utils/format";
import { StatusBadge } from "./StatusBadge";

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <div className="luxury-card luxury-card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-lg font-bold text-primary">{appointment.customerName}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-secondary">{appointmentTypeLabel[appointment.appointmentType]}</p>
        </div>
        <StatusBadge>{appointmentStatusLabel[appointment.status]}</StatusBadge>
      </div>
      <div className="mt-5 grid gap-3 text-sm text-on-surface-variant">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary" />
          {dateTime.format(new Date(appointment.appointmentDate))}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {appointment.location}
        </div>
      </div>
      {appointment.propertyTitle && <p className="mt-5 rounded-xl bg-surface-container-low px-4 py-3 text-sm font-bold text-primary">{appointment.propertyTitle}</p>}
    </div>
  );
}
