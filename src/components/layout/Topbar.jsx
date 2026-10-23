import { Menu, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
export default function Topbar({ toggleSidebar }) {
  const { user } = useContext(AuthContext);
  return <header className="workspace-topbar">
    <div className="flex items-center gap-3"><button onClick={toggleSidebar} className="mobile-menu" aria-label="Open navigation"><Menu size={22}/></button><Link to="/" className="brand"><span className="brand-icon"><FileText size={21}/></span>vinoff<span className="brand-dot">.</span></Link><span className="workspace-label"> / Your workspace</span></div>
    <div className="account"><div><p>{user?.displayName || user?.email || 'Your account'}</p><span>Personal workspace</span></div><span className="avatar">{(user?.email || 'V').charAt(0).toUpperCase()}</span></div>
  </header>;
}
