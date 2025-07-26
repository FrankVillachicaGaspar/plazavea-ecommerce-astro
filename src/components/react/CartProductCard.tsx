import { priceFormatterToPE } from "../../utils/priceFormatter";
import { useCartStore } from "../../lib/store/cart.store";
import { useEffect, useState } from "react";
import {
  addCart,
  clearCart,
  decreaseCart,
  deleteCartProduct,
  getCart,
  getCartResume,
} from "../../lib/api/cart.api";
import type { ICartResume } from "../../types/cart.type";

interface Props {
  token: string;
}

// Componente para mostrar el indicador de carga
const LoadingToast = ({
  message,
  isVisible,
}: {
  message: string;
  isVisible: boolean;
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="alert alert-info shadow-lg flex items-center gap-3 min-w-[280px]">
        <div className="loading loading-spinner loading-sm"></div>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

// Componente skeleton para el carrito
const CartSkeleton = () => (
  <div className="min-h-screen my-4">
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/" className="text-red-700">
                Inicio
              </a>
            </li>
            <li>
              <a href="/products" className="text-red-700">
                Productos
              </a>
            </li>
            <li>Carrito</li>
          </ul>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <h1 className="text-4xl font-bold text-base-content">
            🛍️ Tu Carrito
          </h1>
          <div className="loading loading-spinner loading-md"></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Cargando productos...</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 border border-base-300 rounded-lg"
                  >
                    <div className="w-24 h-24 bg-base-300 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-base-300 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-base-300 rounded animate-pulse w-1/2"></div>
                      <div className="h-8 bg-base-300 rounded animate-pulse w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Resumen del pedido</h2>
              <div className="space-y-3">
                <div className="h-4 bg-base-300 rounded animate-pulse"></div>
                <div className="h-4 bg-base-300 rounded animate-pulse"></div>
                <div className="h-6 bg-base-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function CartProductCard({ token }: Props) {
  const [resume, setResume] = useState<ICartResume>({
    total: 0,
    envio: 0,
    subTotal: 0,
  });

  // Estados de carga
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({
    increasing: false,
    decreasing: false,
    deleting: false,
    clearing: false,
  });
  const [loadingMessage, setLoadingMessage] = useState("");

  const cartItems = useCartStore((state) => state.cartItems);
  const count = useCartStore((state) => state.count);
  const setCount = useCartStore((state) => state.setCount);
  const setProducts = useCartStore((state) => state.setProducts);
  const increase = useCartStore((state) => state.increaseProductQuantity);
  const decrease = useCartStore((state) => state.decreaseProductQuantity);
  const deleteProduct = useCartStore((state) => state.deleteProduct);
  const clearCartStore = useCartStore((state) => state.clearCart);

  const handleResume = async () => {
    const resume = await getCartResume(token);
    setResume(resume);
  };

  const fetchCartItems = async () => {
    try {
      const response = await getCart(token);
      setProducts(response);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const increaseCartProduct = async (idProducto: number) => {
    setLoadingStates((prev) => ({ ...prev, increasing: true }));
    setLoadingMessage("Agregando producto...");

    try {
      const increased = await addCart(token, idProducto);
      if (increased) increase(idProducto);
    } finally {
      setLoadingStates((prev) => ({ ...prev, increasing: false }));
      setLoadingMessage("");
    }
  };

  const decreaseCartProduct = async (idProducto: number) => {
    setLoadingStates((prev) => ({ ...prev, decreasing: true }));
    setLoadingMessage("Reduciendo cantidad...");

    try {
      const decreased = await decreaseCart(token, idProducto);
      if (decreased) decrease(idProducto);
    } finally {
      setLoadingStates((prev) => ({ ...prev, decreasing: false }));
      setLoadingMessage("");
    }
  };

  const deleteProductFromCart = async (idProducto: number) => {
    setLoadingStates((prev) => ({ ...prev, deleting: true }));
    setLoadingMessage("Eliminando producto...");

    try {
      const deleted = await deleteCartProduct(token, idProducto);
      if (deleted) {
        deleteProduct(idProducto);
        setCount(count - 1);
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, deleting: false }));
      setLoadingMessage("");
    }
  };

  const clearCartItems = async () => {
    setLoadingStates((prev) => ({ ...prev, clearing: true }));
    setLoadingMessage("Vaciando carrito...");

    try {
      const cleared = await clearCart(token);
      if (cleared) {
        clearCartStore();
        setCount(0);
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, clearing: false }));
      setLoadingMessage("");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (!isInitialLoading) {
      handleResume();
    }
  }, [cartItems, isInitialLoading]);

  // Verificar si hay alguna acción en proceso
  const isAnyActionLoading = Object.values(loadingStates).some(Boolean);

  // Mostrar skeleton durante la carga inicial
  if (isInitialLoading) {
    return <CartSkeleton />;
  }

  // Carrito vacío (solo después de la carga inicial)
  if (cartItems.length === 0) {
    return (
      <>
        <LoadingToast message={loadingMessage} isVisible={isAnyActionLoading} />
        <div className="text-center py-16">
          <div className="card bg-base-100 shadow-lg max-w-md mx-auto">
            <div className="card-body items-center text-center">
              <div className="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-base-content/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.707 2.707A1 1 0 005 16h16M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4m-8 2h4"
                  />
                </svg>
              </div>
              <h2 className="card-title text-xl mb-2">Tu carrito está vacío</h2>
              <p className="text-base-content/70 mb-6">
                ¡Agrega algunos productos increíbles para comenzar!
              </p>
              <div className="card-actions">
                <a href="/products" className="btn btn-error text-white">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Explorar productos
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LoadingToast message={loadingMessage} isVisible={isAnyActionLoading} />

      <div className="min-h-screen my-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <div className="breadcrumbs text-sm">
              <ul>
                <li>
                  <a href="/" className="text-red-700">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="/products" className="text-red-700">
                    Productos
                  </a>
                </li>
                <li>Carrito</li>
              </ul>
            </div>
            <h1 className="text-4xl font-bold text-base-content mt-4">
              🛍️ Tu Carrito
              {cartItems.length > 0 && (
                <span className="text-lg font-normal text-base-content/70">
                  ({cartItems.length}{" "}
                  {cartItems.length === 1 ? "producto" : "productos"})
                </span>
              )}
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">
                    Productos en tu carrito
                  </h2>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.producto.id}
                        className={`flex flex-col sm:flex-row gap-4 p-4 border border-base-300 rounded-lg hover:shadow-md transition-all ${
                          isAnyActionLoading
                            ? "opacity-70 pointer-events-none"
                            : ""
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-base-300 rounded-lg flex items-center justify-center">
                            <img
                              src={item.producto.urlImagen}
                              alt="producto_imagen"
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-base-content mb-2">
                            {item.producto.descripcion}
                          </h3>
                          <p className="text-base-content/70 text-sm mb-2">
                            Precio unitario:{" "}
                            <span className="font-medium">
                              {priceFormatterToPE.format(item.producto.precio)}
                            </span>
                          </p>

                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm text-base-content/70">
                              Cantidad:
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                className="btn btn-sm btn-circle btn-outline bg-primary text-white disabled:opacity-50"
                                disabled={
                                  item.cantidad <= 1 || loadingStates.decreasing
                                }
                                onClick={() =>
                                  decreaseCartProduct(item.producto.id)
                                }
                              >
                                {loadingStates.decreasing ? (
                                  <div className="loading loading-spinner loading-xs"></div>
                                ) : (
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M20 12H4"
                                    />
                                  </svg>
                                )}
                              </button>
                              <span className="w-8 text-center font-medium">
                                {item.cantidad}
                              </span>
                              <button
                                className="btn btn-sm btn-circle btn-outline btn-success"
                                disabled={loadingStates.increasing}
                                onClick={() =>
                                  increaseCartProduct(item.producto.id)
                                }
                              >
                                {loadingStates.increasing ? (
                                  <div className="loading loading-spinner loading-xs"></div>
                                ) : (
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-red-700">
                              {priceFormatterToPE.format(
                                item.cantidad * item.producto.precio
                              )}
                            </span>
                            <button
                              className="btn btn-sm btn-ghost bg-primary text-white"
                              disabled={loadingStates.deleting}
                              onClick={() =>
                                deleteProductFromCart(item.producto.id)
                              }
                            >
                              {loadingStates.deleting ? (
                                <div className="loading loading-spinner loading-xs"></div>
                              ) : (
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              )}
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="divider"></div>
                  <div className="text-center">
                    <button
                      className="btn btn-outline bg-primary btn-sm text-white"
                      id="clear-cart"
                      disabled={loadingStates.clearing}
                      onClick={clearCartItems}
                    >
                      {loadingStates.clearing ? (
                        <div className="loading loading-spinner loading-xs"></div>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                      Vaciar carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card bg-base-100 shadow-lg sticky top-4">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">
                    Resumen del pedido
                  </h2>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{priceFormatterToPE.format(resume.subTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío:</span>
                      <span>{priceFormatterToPE.format(resume.envio)}</span>
                    </div>
                    <div className="divider my-2"></div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-red-700">
                        {priceFormatterToPE.format(resume.total)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <a
                      href="/pago"
                      className={`btn btn-error btn-block text-white ${
                        isAnyActionLoading ? "btn-disabled" : ""
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Proceder al pago
                    </a>
                    <a href="/products" className="btn btn-outline btn-block">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16l-4-4m0 0l4-4m-4 4h18"
                        />
                      </svg>
                      Seguir comprando
                    </a>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span>Pago seguro</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span>Garantía de satisfacción</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default CartProductCard;
