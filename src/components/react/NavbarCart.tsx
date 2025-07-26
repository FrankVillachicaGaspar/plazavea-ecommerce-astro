import { ShoppingCart } from "lucide-react";
import { useEffect, type FC } from "react";
import { useCartStore } from "../../lib/store/cart.store";
import { getCartCount } from "../../lib/api/cart.api";

interface NavbarCartProps {
  isAuthenticated: boolean;
  token: string;
}

const NavbarCart: FC<NavbarCartProps> = ({ isAuthenticated, token }) => {
  const cartCount = useCartStore((state) => state.count);
  const setCartCount = useCartStore((state) => state.setCount);

  const handleSetCartCount = async () => {
    const count = await getCartCount(token);
    setCartCount(count);
  };

  useEffect(() => {
    if (isAuthenticated && cartCount === 0) {
      handleSetCartCount();
    }
  }, []);

  return (
    <div className="dropdown dropdown-end">
      <a href="/carrito" className="btn btn-primary btn-circle">
        <div className="indicator text-white">
          <ShoppingCart />
          <span
            id="carrito-badge"
            className="badge badge-sm indicator-item bg-red-400 text-white"
          >
            {cartCount}
          </span>
        </div>
      </a>
    </div>
  );
};
export default NavbarCart;
