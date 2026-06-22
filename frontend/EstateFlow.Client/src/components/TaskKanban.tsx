import { ArrowLeft, ArrowRight } from "lucide-react";
import type { TaskItem, TaskStatus } from "../types";
import { priorityLabel, taskStatusLabel } from "../utils/format";
import { isWebLeadTask } from "../utils/leadSource";
import { Button } from "./Button";
import { StatusBadge } from "./StatusBadge";

const columns: TaskStatus[] = ["Todo", "InProgress", "Waiting", "Done"];

interface TaskKanbanProps {
  tasks: TaskItem[];
  onMove: (task: TaskItem, status: TaskStatus) => void;
}

export function TaskKanban({ tasks, onMove }: TaskKanbanProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {columns.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);
        return (
          <section key={status} className="min-h-80 rounded-card border border-outline-variant bg-surface-container-lowest/80 p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-primary">{taskStatusLabel[status]}</h3>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">{columnTasks.length}</span>
            </div>
            <div className="grid gap-3">
              {columnTasks.map((task) => {
                const index = columns.indexOf(task.status);
                const previous = columns[index - 1];
                const next = columns[index + 1];
                const isWebLead = isWebLeadTask(task);

                return (
                  <article key={task.id} className="rounded-2xl border border-outline-variant bg-white p-4 shadow-soft transition hover:-translate-y-0.5">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h4 className="font-heading text-sm font-bold text-primary">{task.title}</h4>
                      <div className="flex flex-wrap justify-end gap-2">

                        {isWebLead && <StatusBadge tone="gold">Web Talebi</StatusBadge>}

                        <StatusBadge>{priorityLabel[task.priority]}</StatusBadge>

                      </div>
                    </div>
                    {task.description && <p className="text-sm leading-6 text-on-surface-variant">{task.description}</p>}
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        icon={<ArrowLeft className="h-4 w-4" />}
                        disabled={!previous}
                        onClick={() => previous && onMove(task, previous)}
                        aria-label="Sola taşı"
                      />
                      <span className="truncate text-xs font-bold uppercase tracking-[0.12em] text-outline">{task.customerName ?? task.propertyTitle ?? "Genel"}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        icon={<ArrowRight className="h-4 w-4" />}
                        disabled={!next}
                        onClick={() => next && onMove(task, next)}
                        aria-label="Sağa taşı"
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
