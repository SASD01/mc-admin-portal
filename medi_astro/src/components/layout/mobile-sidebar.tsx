import { Menu, X } from 'lucide-react';
import * as React from 'react';
import { SidebarProfile } from './sidebar-profile';
import { SidebarNav } from './sidebar-nav';
import { SidebarActions } from './sidebar-actions';

interface MobileSidebarProps {
  active: 'agenda' | 'staff';
}

export function MobileSidebar({ active }: MobileSidebarProps) {
  const [open, setOpen] = React.useState(false);

  // Close drawer on ESC key
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Hamburger button — fixed top bar on mobile */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b border-slate-200/60 bg-white/80 px-4 backdrop-blur-md lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100"
          aria-label="Abrir menú"
        >
          <Menu className="size-6" />
        </button>
        <span className="ml-3 text-[15px] font-semibold text-[#1E2330]">MediConnect</span>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-[280px] flex-col border-r border-slate-200/60 bg-sidebar px-6 py-6 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Cerrar menú"
        >
          <X className="size-5" />
        </button>

        {/* Sidebar content — same as desktop */}
        <div className="mt-4">
          <SidebarProfile />
        </div>
        <SidebarNav active={active} />
        <SidebarActions />
      </aside>
    </>
  );
}
