import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import MyOrdersPage from "./MyOrdersPage";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto flex-grow p-4 md:p-6">
        <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6">
          {/* Left Section */}
          <div className="w-full rounded-lg p-6 shadow-md md:w-1/3 lg:w-1/4">
            <h1 className="mb-4 text-2xl font-bold md:text-3xl">
              {user?.name}
            </h1>
            <p className="mb-4 text-lg text-gray-600">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          {/* Right Section: Orders table */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
}
