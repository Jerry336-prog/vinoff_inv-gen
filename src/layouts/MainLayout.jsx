import { useState } from "react";
import { X } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
export default function MainLayout({ children }) {
  const [open, setOpen] = useState(false);
  return <div className="workspace-shell"><Topbar toggleSidebar={() => setOpen(true)}/>
    {open && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setOpen(false)}/>}
    <aside className={`workspace-sidebar ${open ? 'is-open' : ''}`}><button className="sidebar-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={22}/></button><Sidebar onNavigate={() => setOpen(false)}/></aside>
    <main className="workspace-main">{children}</main>
  </div>;
}
