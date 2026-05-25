import { Sparkles } from "lucide-react";
import * as React from "react";
import { supabase } from "@/lib/supabase";

export function SidebarProfile() {
  const [name, setName] = React.useState<string>("");

  React.useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(async ({ data, error }) => {
      if (!mounted || error || !data?.user) return;

      const { data: admin } = await supabase
        .from("administrators")
        .select("first_name, last_name")
        .eq("id", data.user.id)
        .single();

      if (!mounted) return;

      if (admin?.first_name) {
        setName(`${admin.first_name} ${admin.last_name ?? ""}`.trim());
      } else {
        const raw =
          data.user.user_metadata?.fullName ??
          data.user.email?.split("@")[0] ??
          "Administrador";
        setName(raw.charAt(0).toUpperCase() + raw.slice(1));
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="flex flex-col items-center rounded-3xl border border-slate-200/60 bg-white px-6 py-6 shadow-sm">
      <img
        src="/Profile.svg"
        alt="Perfil"
        width={80}
        height={80}
        className="mb-4 size-20 rounded-full object-cover"
      />
      <h2 className="text-base font-semibold text-[#1E2330]">
        {name || "Cargando..."}
      </h2>
      <div className="mt-3 flex items-center gap-2 rounded-full bg-[#F6F6F8] px-3.5 py-1.5 text-xs font-medium text-[#1E2330]">
        <Sparkles className="size-3" />
        Administrador
      </div>
    </section>
  );
}
