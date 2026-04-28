import { ReactNode } from "react";
import Sidebar from "./Sidebar";

/* Layout principal des pages authentifiées */
interface AppLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export default function AppLayout({ children, isAdmin = false }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f5f6f8]">
      <Sidebar isAdmin={isAdmin} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-5 md:p-6 max-w-[1200px]">
          {children}
        </div>
      </main>
    </div>
  );
}
