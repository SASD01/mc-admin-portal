import { BriefcaseMedical, Workflow } from 'lucide-react';
import { APP_ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  active: 'agenda' | 'staff';
}

export function SidebarNav({ active }: SidebarNavProps) {
  return (
    <nav className="mt-10 space-y-1.5">
      <p className="mb-4 ml-4 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        Panel Administrativo
      </p>

      <a
        href={APP_ROUTES.agenda}
        className={cn(
          'group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-colors',
          active === 'agenda'
            ? 'bg-[#F2F4F7] text-[#464BD8]'
            : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-800',
        )}
      >
        {active === 'agenda' && (
          <div className="absolute left-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-md bg-[#464BD8]" />
        )}
        <Workflow className="size-5" />
        Planificar Agenda
      </a>

      <a
        href={APP_ROUTES.staff}
        className={cn(
          'group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-colors',
          active === 'staff'
            ? 'bg-[#F2F4F7] text-[#464BD8]'
            : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-800',
        )}
      >
        {active === 'staff' && (
          <div className="absolute left-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-md bg-[#464BD8]" />
        )}
        <BriefcaseMedical className="size-5" />
        Personal Médico
      </a>
    </nav>
  );
}
