import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaveModal } from './leave-modal';
import { StaffSearchModal } from './staff-search-modal';

interface StaffToolbarProps {
  view: 'grid' | 'list';
  setView: (view: 'grid' | 'list') => void;
  doctors: any[];
  onEditDoctor: (doc: any) => void;
}

export function StaffToolbar({ view, setView, doctors, onEditDoctor }: StaffToolbarProps) {
  // Convertimos doctors al formato SelectOption para el modal de licencia
  const selectDoctors = doctors.map(d => ({ value: String(d.id), label: d.name }));

  return (
    <div className="mt-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* White Pill Group */}
        <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-white px-2 shadow-sm">
          <LeaveModal doctors={selectDoctors} />
          <div className="h-5 w-[1px] bg-slate-200" />
          <StaffSearchModal doctors={doctors} onSelect={onEditDoctor} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[14px] font-medium text-slate-500">Vista:</span>
        <div className="flex items-center gap-1">
          <button 
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              view === 'grid' ? "bg-[#EEF0FF] text-[#464BD8]" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            )}
            onClick={() => setView('grid')}
            aria-label="Vista cuadrícula"
          >
            <LayoutGrid className="size-5" />
          </button>
          <button 
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              view === 'list' ? "bg-[#EEF0FF] text-[#464BD8]" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            )}
            onClick={() => setView('list')}
            aria-label="Vista lista"
          >
            <List className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
