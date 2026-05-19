import { MoreVertical, UserPlus } from 'lucide-react';

export function StaffList({ doctors, onEdit }: { doctors: any[], onEdit: (doc: any) => void }) {
  return (
    <div className="flex flex-col gap-4">
      {doctors.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between rounded-[16px] border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-8">
            <div className="min-w-[220px]">
              <h3 className="text-[17px] font-semibold text-[#1E2330]">{doc.name}</h3>
              <p className="mt-0.5 text-[14px] text-[#2F78A1]">{doc.specialty}</p>
            </div>
            
            <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
              {doc.status === 'Activo' ? (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF0FF] px-2.5 py-1 text-[13px] font-medium text-[#464BD8]">
                  <div className="size-1.5 rounded-full bg-[#464BD8]" /> Activo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[13px] font-medium text-slate-600">
                  <div className="size-1.5 rounded-full bg-slate-400" /> Licencia
                </span>
              )}
              <span className="text-[14px] text-slate-500">Matrícula: {doc.matricula}</span>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end gap-6 px-8">
            {doc.shifts.length > 0 ? (
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[14px] font-medium text-[#1E2330]">{doc.shifts[0].days}</span>
                <span className="text-[13px] text-slate-500">{doc.shifts[0].time}</span>
              </div>
            ) : (
              <span className="text-[14px] text-slate-400">Sin horarios activos</span>
            )}
          </div>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-8">
            <button 
              onClick={() => onEdit(doc)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] font-medium text-[#1E2330] transition-colors hover:bg-slate-50"
            >
              Editar
            </button>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="size-5" /></button>
          </div>
        </div>
      ))}
      
      <button className="flex w-full items-center justify-center gap-3 rounded-[16px] border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 transition-colors hover:bg-slate-50/80">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF0FF] text-[#464BD8]">
          <UserPlus className="size-5" />
        </div>
        <span className="text-[16px] font-semibold text-[#1E2330]">Registrar Nuevo Especialista</span>
      </button>
    </div>
  );
}
