import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faCartShopping,
  faMagnifyingGlass,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLAttributes, forwardRef, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "src/utils/FirebaseProvider";

interface MiniSearchbarProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onSubmit: React.FormEventHandler;
}

const MiniSearchbar = forwardRef<HTMLFormElement, MiniSearchbarProps>(
  ({ open, onSubmit, ...props }, ref) => {
    return (
      <div
        className={`absolute mt-8 -translate-x-1/2 left-1/2 w-[40vh] p-4 bg-white shadow-ucsd-blue shadow-md
          flex flex-col gap-4 
          rounded-lg transform transition-all duration-150 ease-out 
          ${open ? "opacity-100 " : "opacity-0 pointer-events-none"} 
          `}
        {...props}
      >
        <p className="text-md">Search the marketplace</p>
        <form onSubmit={onSubmit} ref={ref}>
          <div className={`flex flex-row w-full rounded-full border-2 p-2 text-[16px]`}>
            <div className="items-center px-2 pointer-events-none">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                aria-label="faMagnifyingGlass"
                className="text-gray-400"
              />
            </div>
            <input
              name="query"
              className={`w-full focus:outline-none text-[16px]`}
              placeholder="Search UCSD"
            />
          </div>
        </form>
      </div>
    );
  },
);

MiniSearchbar.displayName = "MiniSearchbar";

export function Navbar() {
  const { user, signOutFromFirebase, openGoogleAuthentication } = useContext(FirebaseContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchBarOpen, setSearchbarOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileMenuOpen((o) => !o);
  const iconBtn =
    "w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-ucsd-blue hover:border-ucsd-blue transition";

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    if (!searchRef.current) return;
    e.preventDefault();
    const formData = new FormData(searchRef.current);
    const url = new URL("/products", window.location.origin);
    url.searchParams.set("query", formData.get("query") as string);
    navigate(url.pathname + url.search);
    return;
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

      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchbarOpen(false);
        setTimeout(() => {
          if (searchRef.current) searchRef.current.reset();
        }, 100);
      }
    };
    const handleResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const tabStyling = "text-gray-400 hover:text-gray-800";
  const selectedTabStyling = "text-ucsd-blue";

  return (
    <>
      <nav className="font-rubik shadow-md shadow-ucsd-blue bg-white c left-0 right-0 min-w-0 mx-12 rounded-b-lg h-12 max-h-12 px-6 py-10 flex items-center justify-between fixed top-0 z-50">
        {/* Desktop View */}
        <button
          className="text-lg font-semibold"
          onClick={() => (window.location.href = "/products")}
        >
          <span className="text-3xl text-ucsd-blue">Low </span>
          <span className="text-3xl text-ucsd-gold">Price Center</span>
        </button>
        <div
          className={`hidden ${!user && "opacity-0"} md:flex flex-row gap-3 items-center justify-center`}
        >
          {[
            { label: "Shop", path: "/products" },
            { label: "Sell", path: "/sell" },
            { label: "Student Organizations", path: "/organizations" },
          ].map((val) => (
            <button
              key={val.label}
              className={`${window.location.pathname === val.path ? selectedTabStyling : tabStyling}`}
              onClick={() => {
                window.location.href = val.path;
              }}
            >
              {val.label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center text-2xl space-x-4">
          <button
            onClick={() => (window.location.href = "/saved-products")}
            className={`${!user && "opacity-0"} w-12 h-12 text-xl flex items-center justify-center border-2 hover:bg-gray-300 rounded-full transition-colors`}
          >
            <FontAwesomeIcon icon={faHeart} aria-label="Heart Icon" />
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setSearchbarOpen(true);
              }}
              className={`${!user && "opacity-0"} w-12 h-12 text-xl flex items-center justify-center border-2 hover:bg-gray-300 rounded-full transition-colors`}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} aria-label="faMagnifyingGlass" />
            </button>
            <MiniSearchbar open={isSearchBarOpen} ref={searchRef} onSubmit={handleSearch} />
          </div>

          <button
            onClick={() => (window.location.href = "/products")}
            className={`${!user && "opacity-0"} w-12 h-12 text-xl flex items-center justify-center border-2 hover:bg-gray-300 rounded-full transition-colors`}
          >
            <FontAwesomeIcon icon={faCartShopping} aria-label="Shopping Cart" />
          </button>

          <button
            onClick={user ? signOutFromFirebase : openGoogleAuthentication}
            className="px-4 py-1 bg-transparent border-transparent rounded transition-colors"
          >
            {user ? "Log Out" : "Log In"}
          </button>
        </div>
        <li>
          <button
            onClick={() => (window.location.href = "/add-product")}
            className="hover:text-ucsd-blue transition-colors"
          >
            Sell
          </button>
        </li>
        <li>
          <button
            onClick={() => (window.location.href = "/student-organizations")}
            className="hover:text-ucsd-blue transition-colors"
          >
            Student Organizations
          </button>
        </li>

        {/* ── Desktop right icons ── */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Saved / Heart */}
          <button
            onClick={() => (window.location.href = "/saved-products")}
            title="Saved"
            className={iconBtn}
          >
            <svg
              className="w-[18px] h-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Cart / Products */}
          <button
            onClick={() => (window.location.href = "/products")}
            title="Products"
            className={iconBtn}
          >
            <svg
              className="w-[18px] h-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>

          {/* User avatar / Sign in */}
          {user ? (
            <button
              onClick={signOutFromFirebase}
              title="Sign Out"
              className="w-9 h-9 rounded-full bg-ucsd-blue text-white flex items-center justify-center font-jetbrains font-bold text-sm hover:brightness-90 transition"
            >
              {user.displayName?.[0]?.toUpperCase() ?? "U"}
            </button>
          ) : (
            <button
              onClick={openGoogleAuthentication}
              className="font-inter text-sm font-semibold text-ucsd-blue hover:underline px-1"
            >
              Sign In
            </button>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <div className="md:hidden relative">
          <button
            ref={buttonRef}
            className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition text-gray-600"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <FontAwesomeIcon className="text-xl" icon={isMobileMenuOpen ? faXmark : faBars} />
          </button>

          <ul
            ref={menuRef}
            className={`absolute top-11 right-0 bg-white border border-gray-100 shadow-lg rounded-xl w-52 p-3 text-sm font-inter font-medium text-gray-700
              transition-all duration-200 ${isMobileMenuOpen ? "block" : "hidden"}`}
          >
            <li className="mb-1">
              <button
                onClick={() => (window.location.href = "/marketplace")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-ucsd-blue font-semibold transition"
              >
                Shop
              </button>
            </li>
            <li className="mb-1">
              <button
                onClick={() => (window.location.href = "/add-product")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Sell
              </button>
            </li>
            <li className="mb-1">
              <button
                onClick={() => (window.location.href = "/student-organizations")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Student Organizations
              </button>
            </li>
            <li className="mb-1">
              <button
                onClick={() => (window.location.href = "/saved-products")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Saved
              </button>
            </li>
            <li className="mb-1">
              <button
                onClick={() => (window.location.href = "/products")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Products
              </button>
            </li>
            <li className="border-t border-gray-100 mt-1 pt-1">
              {user ? (
                <button
                  onClick={signOutFromFirebase}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition text-red-500"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={openGoogleAuthentication}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition text-ucsd-blue font-semibold"
                >
                  Sign In
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <button
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 cursor-default"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
