import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AppLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export default async function AppLayout({ children, isAdmin = false }: AppLayoutProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userName = "";
  if (user) {
    const { data } = await supabase
      .from("members")
      .select("prenom, nom")
      .eq("id", user.id)
      .single();
    if (data) userName = `${data.prenom} ${data.nom}`;
  }

  return (
    <div className="flex min-h-screen bg-[#f5f6f8]">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar userName={userName} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-6 max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
