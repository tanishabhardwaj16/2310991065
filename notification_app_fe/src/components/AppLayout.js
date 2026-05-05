"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

export default function AppLayout({ children }) {
  const pathname = usePathname();
  
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return <Navigation>{children}</Navigation>;
}
