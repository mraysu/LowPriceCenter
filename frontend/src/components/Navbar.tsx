import {
  faBars,
  faCartShopping,
  faUser,
  faXmark,
  faHeart,
  faUsers,
  faStore,
  faChevronDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { get } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";

export function Navbar() {
  const { user, signOutFromFirebase, openGoogleAuthentication } = useContext(FirebaseContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isStudentOrgDropdownOpen, setStudentOrgDropdownOpen] = useState(false);
  const [canAccessMyOrganization, setCanAccessMyOrganization] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      setCanAccessMyOrganization(false);
      return;
    }
    get("/api/student-organizations/can-access")
      .then((res) => res.json())
      .then((data: { canAccess?: boolean }) => setCanAccessMyOrganization(data.canAccess === true))
      .catch(() => setCanAccessMyOrganization(false));
  }, [user]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setStudentOrgDropdownOpen(false);
      }
    };

    const handleResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav className="w-full sticky top-0 z-50">
        <div className="px-4 pt-3">
          <div className="mx-auto max-w-6xl bg-white rounded-2xl shadow-md border border-gray-200">
            <div className="h-14 px-4 flex items-center justify-between">
              {/* Brand */}
              <button
                className="font-jetbrains text-xl tracking-tight"
                onClick={() => (window.location.href = "/products")}
                aria-label="Go to products"
              >
                <span className="text-ucsd-blue">Low</span>{" "}
                <span className="text-figma-orange">Price</span>{" "}
                <span className="text-ucsd-blue">Center</span>
              </button>

              {/* Center links (desktop) */}
              <div className="hidden md:flex items-center gap-6">
                <button
                  hidden={user === null}
                  onClick={() => (window.location.href = "/products")}
                  className="font-inter text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Shop
                </button>
                <button
                  hidden={user === null}
                  onClick={() => (window.location.href = "/add-product")}
                  className="font-inter text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Sell
                </button>
                <div className="relative" ref={dropdownRef}>
                  <button
                    hidden={user === null}
                    onClick={() => setStudentOrgDropdownOpen(!isStudentOrgDropdownOpen)}
                    className="font-inter text-sm text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-2"
                  >
                    Student Organizations
                    <FontAwesomeIcon className="text-xs" icon={faChevronDown} aria-label="Dropdown" />
                  </button>
                  {isStudentOrgDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 min-w-[220px] overflow-hidden z-50">
                      {canAccessMyOrganization && (
                        <button
                          onClick={() => {
                            window.location.href = "/student-org-profile";
                            setStudentOrgDropdownOpen(false);
                          }}
                          className="font-inter w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <FontAwesomeIcon className="text-sm text-gray-600" icon={faUsers} />
                          My Organization
                        </button>
                      )}
                      <button
                        onClick={() => {
                          window.location.href = "/student-organizations";
                          setStudentOrgDropdownOpen(false);
                        }}
                        className="font-inter w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <FontAwesomeIcon className="text-sm text-gray-600" icon={faStore} />
                        Browse Organizations
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right icons (desktop) */}
              <div className="hidden md:flex items-center gap-3">
                <button
                  hidden={user === null}
                  onClick={() => (window.location.href = "/saved-products")}
                  className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-700"
                  aria-label="Saved products"
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <button
                  hidden={user === null}
                  onClick={() => {}}
                  className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-700"
                  aria-label="Search"
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
                <button
                  hidden={user === null}
                  onClick={() => (window.location.href = "/products")}
                  className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-700"
                  aria-label="Cart"
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                </button>

                {user ? (
                  <button
                    onClick={signOutFromFirebase}
                    className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-700"
                    aria-label="Sign out"
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                ) : (
                  <button
                    onClick={openGoogleAuthentication}
                    className="px-4 h-9 rounded-full bg-figma-teal text-white font-inter text-sm hover:brightness-95 transition-all"
                    aria-label="Sign in"
                  >
                    Sign in
                  </button>
                )}
              </div>

              {/* Mobile */}
              <div className="md:hidden relative">
                <button
                  ref={buttonRef}
                  className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-700"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle mobile menu"
                >
                  <FontAwesomeIcon className="text-lg" icon={isMobileMenuOpen ? faXmark : faBars} />
                </button>
                <ul
                  ref={menuRef}
                  className={`absolute top-12 right-0 bg-white text-gray-800 text-sm shadow-lg rounded-xl w-56 p-2 border border-gray-200 ${
                    isMobileMenuOpen ? "block" : "hidden"
                  }`}
                >
                  <li>
                    <button
                      hidden={user === null}
                      onClick={() => {
                        window.location.href = "/products";
                        setMobileMenuOpen(false);
                      }}
                      className="font-inter w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <FontAwesomeIcon className="text-gray-600" icon={faCartShopping} />
                      Shop
                    </button>
                  </li>
                  <li>
                    <button
                      hidden={user === null}
                      onClick={() => {
                        window.location.href = "/add-product";
                        setMobileMenuOpen(false);
                      }}
                      className="font-inter w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <FontAwesomeIcon className="text-gray-600" icon={faStore} />
                      Sell
                    </button>
                  </li>
                  <li>
                    <button
                      hidden={user === null}
                      onClick={() => {
                        window.location.href = "/saved-products";
                        setMobileMenuOpen(false);
                      }}
                      className="font-inter w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <FontAwesomeIcon className="text-gray-600" icon={faHeart} />
                      Saved
                    </button>
                  </li>
                  <li>
                    <button
                      hidden={user === null}
                      onClick={() => {
                        window.location.href = "/student-organizations";
                        setMobileMenuOpen(false);
                      }}
                      className="font-inter w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <FontAwesomeIcon className="text-gray-600" icon={faUsers} />
                      Student Organizations
                    </button>
                  </li>
                  {canAccessMyOrganization && (
                    <li>
                      <button
                        hidden={user === null}
                        onClick={() => {
                          window.location.href = "/student-org-profile";
                          setMobileMenuOpen(false);
                        }}
                        className="font-inter w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <FontAwesomeIcon className="text-gray-600" icon={faUsers} />
                        My Organization
                      </button>
                    </li>
                  )}
                  <li className="pt-1 border-t border-gray-100 mt-1">
                    {user ? (
                      <button
                        onClick={(e) => {
                          signOutFromFirebase(e);
                          setMobileMenuOpen(false);
                        }}
                        className="font-inter w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <FontAwesomeIcon className="text-gray-600" icon={faUser} />
                        Sign out
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          openGoogleAuthentication(e);
                          setMobileMenuOpen(false);
                        }}
                        className="font-inter w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <FontAwesomeIcon className="text-gray-600" icon={faUser} />
                        Sign in
                      </button>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Blur Effect */}
      {isMobileMenuOpen && (
        <button
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 cursor-default"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
