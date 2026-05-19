import * as React from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export function StaffSearchModal({ doctors, onSelect }: { doctors: any[], onSelect?: (doc: any) => void }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!query) return doctors;
    const lower = query.toLowerCase();
    return doctors.filter(d => 
      d.name.toLowerCase().includes(lower) || 
      d.specialty.toLowerCase().includes(lower)
    );
  }, [doctors, query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          type="button"
          className="flex items-center gap-2 px-4 text-[14px] font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <Search className="size-4" /> Buscar Médico
        </button>
      </DialogTrigger>
      {/* Removemos max-w por defecto para darle estilo Spotlight */}
      <DialogContent className="top-[10%] max-w-2xl translate-y-0 gap-0 p-0 shadow-2xl sm:rounded-xl [&>button]:top-3 [&>button]:right-4">
        <div className="flex items-center border-b border-slate-200 px-4">
          <Search className="mr-2 size-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            className="flex h-14 w-full rounded-md bg-transparent py-3 pr-14 text-lg outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No se encontraron resultados.</p>
          ) : (
            filtered.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  onSelect?.(doc);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-slate-100"
              >
                <div>
                  <h4 className="font-medium text-[#1E2330]">{doc.name}</h4>
                  <p className="text-sm text-slate-500">{doc.specialty}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${doc.status === 'Activo' ? 'bg-[#EEF0FF] text-[#464BD8]' : 'bg-slate-100 text-slate-600'}`}>
                    {doc.status}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
