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
import { FirebaseContext } from "src/utils/FirebaseProvider";

interface MiniSearchbarProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onSubmit: () => void;
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    if (!searchRef.current) return;
    e.preventDefault();
    const formData = new FormData(searchRef.current);
    const url = new URL("/products", window.location.origin);
    url.searchParams.append("query", formData.get("query") as string);
    console.log(url.toString());
    window.location.href = url.toString();
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

        {/* Mobile View */}
        <div className="md:hidden relative">
          <button
            ref={buttonRef}
            className="px-2.5 pt-1 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <FontAwesomeIcon className="text-2xl" icon={isMobileMenuOpen ? faXmark : faBars} />
          </button>
          <ul
            ref={menuRef}
            className={`absolute top-12 right-0.5 bg-ucsd-blue text-white text-lg shadow-lg rounded-lg w-48 p-4 
            transition-transform duration-300 ${isMobileMenuOpen ? "block" : "hidden"}`}
          >
            <li className="mb-2">
              <button
                hidden={user === null}
                onClick={() => (window.location.href = "/products")}
                className="font-inter w-full text-center px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors"
              >
                <FontAwesomeIcon
                  className="text-lg pr-2"
                  icon={faCartShopping}
                  aria-label="Shopping Cart"
                />
                Products
              </button>
            </li>
            <li>
              {user ? (
                <button
                  onClick={signOutFromFirebase}
                  className="font-inter w-full text-center px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors"
                >
                  <FontAwesomeIcon className="text-lg pr-2" icon={faUser} aria-label="User Icon" />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={openGoogleAuthentication}
                  className="font-inter w-full text-center px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors"
                >
                  <FontAwesomeIcon className="text-lg pr-2" icon={faUser} aria-label="User Icon" />
                  Sign In
                </button>
              )}
            </li>
          </ul>
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
