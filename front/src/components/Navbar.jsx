import { NavLink } from "react-router-dom";
import { useFirebase } from "../config/firebase";
function Navbar() {
  const { signout } = useFirebase();
  return (
    <div className="flex flex-row items-center h-[10vh] sticky shadow-[#0D1B2A] w-full justify-center p-4 gap-10 text-xl">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          ` ${isActive ? "text-[#FFB400]" : "text-[#E0E1DD]"} `
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/visuals"
        className={({ isActive }) =>
          ` ${isActive ? "text-[#FFB400]" : "text-[#E0E1DD]"} `
        }
      >
        Visuals
      </NavLink>
      <NavLink to="" className="text-[#E0E1DD]" onClick={signout}>
        Logout
      </NavLink>
    </div>
  );
}

export default Navbar;
