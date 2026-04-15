import type { ReactNode } from "react";

type AppShellProps = {
  title: string;
  children: ReactNode;
};

export default function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-slate-300" />
          <span className="h-3 w-3 rounded-full bg-slate-300" />
          <span className="h-3 w-3 rounded-full bg-slate-300" />
        </div>
      </div>

      <div className="min-h-[560px] p-5">{children}</div>
    </div>
  );
}