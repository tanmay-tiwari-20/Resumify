import { Link } from "react-router";
import PillNav from "./PillNav";
import logo from '../../public/R.png'

const Navbar = () => {
  return (
    <nav className="flex items-center justify-center">
      <PillNav
        logo={logo}
        logoAlt="Company Logo"
        items={[
          { label: "Home", href: "/" },
          { label: "Upload", href: "/upload" },
        ]}
        activeHref="/"
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="#ffffff"
        pillColor="#DFECFF"
        hoveredPillTextColor="#000000"
        pillTextColor="#000000"
      />
    </nav>
  );
};

export default Navbar;
