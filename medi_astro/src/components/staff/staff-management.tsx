import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { agendaService } from '@/services/agenda.service';
import { StaffToolbar } from './staff-toolbar';
import { StaffGrid } from './staff-grid';
import { StaffList } from './staff-list';
import { EditShiftModal } from './edit-shift-modal';

type ViewMode = 'grid' | 'list';

export function StaffManagement() {
  const [view, setView] = React.useState<ViewMode>('grid');
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingDoctor, setEditingDoctor] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchStaff() {
      const { data, error } = await agendaService.getStaffWithSchedules();

      if (!error && data) {
        const formattedDoctors = data.map((doc) => {
          const shifts = doc.doctor_schedules?.map((s: any) => ({
            days: s.start_date,
            time: `${s.start_time.substring(0, 5)} - ${s.end_time.substring(0, 5)}`
          })) || [];

          return {
            id: doc.id,
            name: `Dr. ${doc.first_name} ${doc.last_name}`,
            specialty: doc.speciality,
            status: doc.status === 'on_leave' ? 'Licencia Médica' : 'Activo',
            matricula: doc.license_number || 'N/A',
            shifts: shifts
          };
        });

        // Ordenar: Primero los médicos con turnos asignados
        formattedDoctors.sort((a, b) => {
          if (a.shifts.length > 0 && b.shifts.length === 0) return -1;
          if (a.shifts.length === 0 && b.shifts.length > 0) return 1;
          return 0;
        });

        setDoctors(formattedDoctors);
      }
      setLoading(false);
    }
    fetchStaff();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <StaffToolbar view={view} setView={setView} doctors={doctors} onEditDoctor={setEditingDoctor} />

      {loading ? null : view === 'grid' ? (
        <StaffGrid doctors={doctors} onEdit={setEditingDoctor} />
      ) : (
        <StaffList doctors={doctors} onEdit={setEditingDoctor} />
      )}
      
      <EditShiftModal doctor={editingDoctor} onClose={() => setEditingDoctor(null)} />
    </div>
  );
}
