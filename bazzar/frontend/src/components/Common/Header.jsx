import TopBar from "../Layout/TopBar";
import NavBar from "./NavBar";

export default function Header() {
  return (
    <header className="border-b border-gray-200">
      {/* Topbar */}
      <TopBar />
      {/* Navbar */}
      <NavBar />
      {/* Cart Drawer */}
    </header>
  );
}
