import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CartContents from "../Cart/CartContents";

export default function CartDrawer({ drawerOpen, toggleCartDrawer }) {
  const navigate = useNavigate();

  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const userId = user ? user._id : null;

  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };
  return (
    <div
      className={`fixed top-0 right-0 z-50 flex h-full w-3/4 transform flex-col bg-white shadow-lg transition-transform duration-300 sm:w-1/2 md:w-[30rem] ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="size-6 text-gray-600" />
        </button>
      </div>
      {/* Cart Content with scrollable area */}
      <div className="flex-grow overflow-y-auto p-4">
        <h2 className="mb-4 text-xl font-semibold">Your Cart</h2>
        {cart && cart?.products?.length > 0 ? (
          <CartContents cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      {/* Checkout button fixed at the bottom */}
      <div className="sticly bottom-0 bg-white p-4">
        {cart && cart?.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Checkout
            </button>
            <p className="mt-2 text-center text-sm tracking-tighter text-gray-500">
              Shipping, taxes, and discount codes calculated at checkout
            </p>
          </>
        )}
      </div>
    </div>
  );
}
