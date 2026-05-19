import { Sparkles } from 'lucide-react';
import * as React from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

export function SidebarProfile() {
  const [name, setName] = React.useState<string>('Administrador');

  React.useEffect(() => {
    let mounted = true;

      getSupabaseClient()
        .auth.getUser()
        .then(async ({ data, error }) => {
          if (mounted && !error && data?.user) {
            const userId = data.user.id;
            
            // Consultamos la tabla administrators
            const { data: adminData } = await getSupabaseClient()
              .from('administrators')
              .select('first_name, last_name')
              .eq('id', userId)
              .single();

            if (adminData && adminData.first_name) {
              setName(`${adminData.first_name} ${adminData.last_name || ''}`.trim());
            } else {
              // Fallback
              const rawName =
                data.user.user_metadata?.fullName ||
                data.user.app_metadata?.fullName ||
                data.user.email?.split('@')[0] ||
                'Administrador';

              const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
              setName(formattedName);
            }
          }
        })
        .catch(() => {
          // Ignorar errores
        });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative z-10 flex min-h-[216px] flex-col items-center justify-center rounded-[24px] border border-slate-200/60 bg-white px-6 py-6 shadow-sm">
      <img
        src="/Profile.svg"
        alt="Perfil del administrador"
        width={80}
        height={80}
        className="mb-4 size-[80px] rounded-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e1"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E';
        }}
      />
      <h2 className="text-xl font-medium tracking-tight text-[#1E2330]">{name}</h2>
      <div className="mt-3 flex items-center gap-2 rounded-full bg-[#F6F6F8] px-3.5 py-1.5 text-sm font-medium text-[#1E2330]">
        <Sparkles className="size-3.5" />
        Administrador
      </div>
    </section>
  );
}
