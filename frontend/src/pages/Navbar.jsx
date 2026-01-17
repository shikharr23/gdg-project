import { NavLink } from "react-router-dom";

const Navbar = () => {
  const navClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <div>
      <nav className="navbar flex gap-4 px-auto py-4 bw-bg mt-3 justify-center rounded-md w-2/4 mx-auto bw-border">
        <NavLink to="/" className={navClass} end>Home</NavLink>
        <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
        <NavLink to="/subjects" className={navClass}>Subjects</NavLink>
        <NavLink to="/bunk-analysis" className={navClass}>Bunk Analysis</NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
