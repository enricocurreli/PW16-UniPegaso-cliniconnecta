import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import Button from "./Button";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="navbar shadow-md hidden md:flex py-4 justify-between bg-base-200 ">
        <div className="">
          <Link to="/" className="btn btn-ghost text-2xl text-primary">
            <img
              src="./../../public/icons8-cuore-con-impulso-96.png"
              className="w-10"
              alt=""
            />
            CliniConnecta
          </Link>
        </div>
        <div>
          <div className="pr-4 pl-10">
            <ThemeToggle />
            <Link to="/doctors" className="md:text-xl px-4">
              Dottori
            </Link>
            {isAuthenticated && (
              <div className="dropdown dropdown-end pl-4">
                <div tabIndex={0} role="button">
                  <div className="avatar avatar-placeholder">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium hover:bg-blue-600 cursor-pointer transition">
                      <img
                        src="../../public/icons8-user-64.png"
                        className="bg-amber-50 rounded-full w-24"
                        alt=""
                      />
                    </div>
                  </div>
                </div>

                <ul
                  tabIndex={-1}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link className="md:text-xl" to="/profile">
                      Profilo
                    </Link>
                  </li>
                  <li>
                    <Link className="md:text-xl" to="/">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="md:text-xl" to="/my-appointments">
                      Appuntamenti
                    </Link>
                  </li>
                  <li>
                    <Button onClick={handleLogout} classes="md:text-xl">
                      Logout
                    </Button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="drawer">
        <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content py-2 shadow-md w- flex justify-between md:hidden">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-1"
            className="btn drawer-button bg-transparent border-0 shadow-none"
          >
            <div className="bg-primary text-neutral-content p-2 rounded-full">
              <span className="text-xl">D</span>
              <span className="text-xl">D</span>
            </div>
          </label>
          <Link to="/" className="btn btn-ghost text-xl text-primary">
            CliniConnecta
          </Link>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-1"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          {isAuthenticated && (
            <ul className="menu bg-base-200 min-h-full w-50 p-4">
              {/* Sidebar content here */}

              <li>
                <Link className="md:text-xl" to="/profile">
                  Profilo
                </Link>
              </li>
              <li>
                <Link className="md:text-xl" to="/">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link className="md:text-xl" to="/appointments">
                  Appuntamenti
                </Link>
              </li>
              <li>
                <Button onClick={handleLogout} classes="md:text-xl">
                  Logout
                </Button>
              </li>
              <li>
                <Link to="/doctors" className="md:text-xl">
                  Dottori
                </Link>
              </li>
              <li className="w-20">
                <ThemeToggle />
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
