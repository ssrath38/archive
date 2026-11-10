import { Outlet } from "react-router";
import Footer from "../Common/Footer";
import Header from "../Common/Header";

export default function UserLayout() {
  return (
    <>
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main>
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </>
  );
}
