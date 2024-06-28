import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Context from "../utills/Context";

export function RootLayout() {
  return (
    <Context>
      <div className="h-screen w-screen flex flex-col">
        <Navbar />
        <Outlet />
      </div>
    </Context>
  );
}
