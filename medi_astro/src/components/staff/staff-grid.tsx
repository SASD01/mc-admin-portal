import { MoreVertical, UserPlus } from 'lucide-react';

export function StaffGrid({ doctors, onEdit }: { doctors: any[], onEdit: (doc: any) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {doctors.map((doc) => (
        <div key={doc.id} className="rounded-[20px] border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-[#1E2330]">{doc.name}</h3>
              <p className="mt-1 text-[15px] text-[#2F78A1]">{doc.specialty}</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="size-5" /></button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            {doc.status === 'Activo' ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF0FF] px-2.5 py-1 text-[13px] font-medium text-[#464BD8]">
                <div className="size-1.5 rounded-full bg-[#464BD8]" />
                Activo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[13px] font-medium text-slate-600">
                <div className="size-1.5 rounded-full bg-slate-400" />
                Licencia Médica
              </span>
            )}
            <span className="text-[14px] text-slate-500">•</span>
            <span className="text-[14px] text-slate-500">Matrícula: {doc.matricula}</span>
          </div>

          <hr className="my-4 border-slate-200" />

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Turnos Generales Asignados</h4>
            {doc.shifts.length > 0 ? (
              <div className="mt-3 space-y-2">
                {doc.shifts.map((shift: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-[14px]">
                    <span className="font-medium text-[#1E2330]">{shift.days}</span>
                    <span className="rounded border border-slate-200 px-2 py-0.5 text-slate-600">{shift.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-4 text-center">
                <span className="text-[14px] text-slate-400">Sin horarios activos</span>
              </div>
            )}
          </div>

          <button 
            onClick={() => onEdit(doc)}
            className="mt-4 w-full rounded-xl border border-slate-200 py-2 text-[14px] font-medium text-[#1E2330] transition-colors hover:bg-slate-50"
          >
            Editar Turnos
          </button>
        </div>
      ))}

      <button className="flex min-h-[260px] flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center transition-colors hover:bg-slate-50/80">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF0FF] text-[#464BD8]">
          <UserPlus className="size-7" />
        </div>
        <h3 className="text-lg font-semibold text-[#1E2330]">Registrar Nuevo Especialista</h3>
        <p className="mt-2 max-w-[200px] text-[14px] text-slate-500">
          Añade un nuevo perfil médico para gestionar sus horarios.
        </p>
      </button>
    </div>
  );
}
