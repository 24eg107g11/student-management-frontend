import { Link, useLocation } from "react-router-dom";

function Navbar() {

  const location = useLocation();

  const logout = () => {

    localStorage.removeItem("token");

    window.location.href = "/";

  };

  return (

    <nav className="navbar">

      <div className="navbar-logo">
        🎓 Student Management
      </div>


      <div className="navbar-links">

        <Link
          to="/dashboard"
          className={
            location.pathname === "/dashboard"
              ? "nav-link active"
              : "nav-link"
          }
        >
          Dashboard
        </Link>


        <button
          className="nav-logout"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </nav>

  );
}

export default Navbar;