import { createElement } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { LayoutDashboard, Files, Plus, LogOut, ArrowUpRight } from "lucide-react";

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const logout = async () => {
    try { await signOut(getAuth()); navigate('/login'); }
    catch (error) { console.error('Logout error:', error); }
  };
  return <div className="sidebar-content">
    <p className="nav-caption">WORKSPACE</p>
    <nav aria-label="Workspace navigation">
      {[["/dashboard", LayoutDashboard, "Overview"], ["/invoicelist", Files, "Invoices"], ["/invoicecreate", Plus, "Create invoice"]].map(([to, Icon, label]) =>
        <NavLink key={to} to={to} onClick={onNavigate} className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>{createElement(Icon, { size: 19 })}{label}</NavLink>
      )}
    </nav>
    <div className="sidebar-bottom"><div className="workspace-note"><span className="eyebrow">LESS ADMIN. MORE BUSINESS.</span><p>Your next invoice starts here.</p><NavLink to="/invoicecreate" onClick={onNavigate}>Create an invoice <ArrowUpRight size={16}/></NavLink></div>
    <button onClick={logout} className="nav-item logout"><LogOut size={18}/> Sign out</button></div>
  </div>;
}
