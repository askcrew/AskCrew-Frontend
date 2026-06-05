import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-slate-950" />
        <div className="pointer-events-none absolute -top-32 right-[-25%] h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,171,249,0.4),transparent_65%)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-30%] left-[-20%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(78,145,143,0.35),transparent_70%)] blur-3xl" />

        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
