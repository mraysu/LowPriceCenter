import { Outlet } from "react-router-dom";
import { Navbar } from "src/components/Navbar";

export const RootLayout = () => {
  return (
    <>
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
    </>
  );
};
