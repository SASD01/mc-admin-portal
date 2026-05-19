import { LogOut, RotateCcw, Settings, Trash2 } from 'lucide-react';
import { APP_ROUTES } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { authService } from '@/services/auth.service';

export function SidebarActions() {
  return (
    <div className="mt-auto flex flex-col gap-1 pb-4">
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200/50">
            <Settings className="size-5 text-slate-500" /> Configuración
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-[460px]">
          <div className="mt-2 space-y-5 sm:mt-4 sm:space-y-6">
            <section>
              <h3 className="text-lg font-semibold sm:text-xl">Restablecer contraseña</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:text-base">Se enviará un enlace seguro al correo electrónico registrado para actualizar su contraseña.</p>
              <Button className="mt-4 w-full bg-[#464BD8] hover:bg-[#3D41BC] sm:mt-5">
                <RotateCcw className="mr-2 size-4" /> Restablecer contraseña
              </Button>
            </section>
            <div className="h-px w-full bg-slate-200" />
            <section>
              <h3 className="text-lg font-semibold text-red-600 sm:text-xl">Eliminar cuenta</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:text-base">Esta acción es irreversible. Resultará en la pérdida permanente de todos sus datos y configuraciones.</p>
              <Button variant="destructive" className="mt-4 w-full border-none bg-red-50 text-red-700 shadow-none hover:bg-red-100 sm:mt-5">
                <Trash2 className="mr-2 size-4" /> Eliminar cuenta permanentemente
              </Button>
            </section>
          </div>
        </DialogContent>
      </Dialog>
      <button onClick={() => { authService.signOut().then(() => { window.location.assign(APP_ROUTES.login); }); }} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600">
        <LogOut className="size-5" /> Cerrar Sesión
      </button>
    </div>
  );
}
