import React from "react";
import { AdminShell } from "./_components/AdminShell";

export const metadata = {
  title: "Admin Studio - Portfolio Data Control",
  description: "Manage portfolio modes, projects, career experience, and personal details.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}


