import type { FC } from "react";
import { useState, useEffect } from "react";
import type { Carrito, Product } from "../../db/schema";
import { addCart } from "../../lib/api/cart.api";
import { useCartStore } from "../../lib/store/cart.store";

interface AddToCartButtonProps {
  carrito?: Carrito;
  producto: Product;
  isAuthenticated: boolean;
  token: string;
}

const AddToCartButton: FC<AddToCartButtonProps> = ({
  carrito,
  isAuthenticated,
  producto,
  token,
}) => {
  const count = useCartStore((state) => state.count);
  const setCount = useCartStore((state) => state.setCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Inicializar el estado basado en si el producto ya está en el carrito
  useEffect(() => {
    setIsInCart(carrito !== undefined);
  }, [carrito]);

  const addToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    setIsLoading(true);

    try {
      const added = await addCart(token, producto.id);

      if (added) {
        // Mostrar animación de éxito
        setShowSuccess(true);
        setCount(count + 1);

        // Después de la animación, cambiar el estado
        setTimeout(() => {
          setIsInCart(true);
          setShowSuccess(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos CSS personalizados para las animaciones
  const buttonStyles = `
    .cart-button-container {
      position: relative;
      overflow: hidden;
    }
    
    .bounce-animation {
      animation: bounceSuccess 0.6s ease-in-out;
    }
    
    .slide-in {
      animation: slideIn 0.5s ease-out;
    }
    
    .pulse-success {
      animation: pulseSuccess 1s ease-in-out;
    }
    
    @keyframes bounceSuccess {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes slideIn {
      0% { 
        opacity: 0; 
        transform: translateY(20px); 
      }
      100% { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    
    @keyframes pulseSuccess {
      0%, 100% { 
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); 
      }
      50% { 
        box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); 
      }
    }
    
    .loading-spinner {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{buttonStyles}</style>
      <div
        className="card-actions justify-end cart-button-container"
        id="buttonAgrogarCarrito"
      >
        {!isInCart ? (
          <>
            {/* Botón de loading */}
            {isLoading && (
              <button
                className="btn btn-primary bg-red-700! text-white btn-lg w-full gap-2"
                disabled
              >
                <i className="fa fa-spinner loading-spinner"></i>
                Agregando...
              </button>
            )}

            {/* Botón de éxito temporal */}
            {showSuccess && !isLoading && (
              <button
                className="btn bg-green-600! text-white btn-lg w-full gap-2 bounce-animation pulse-success"
                disabled
              >
                <i className="fa fa-check"></i>
                ¡Agregado al carrito!
              </button>
            )}

            {/* Botón principal */}
            {!isLoading && !showSuccess && (
              <button
                className="btn btn-primary text-white btn-lg w-full gap-2 hover:scale-105 transition-transform duration-200 disabled:text-black"
                disabled={producto?.stock === 0}
                onClick={addToCart}
                id="carritoBtn"
              >
                <i className="fa fa-shopping-cart"></i>
                {producto?.stock === 0
                  ? "Producto agotado"
                  : "Agregar al carrito"}
              </button>
            )}
          </>
        ) : (
          <div className="slide-in">
            <a
              href="/carrito"
              className="btn btn-success btn-outline border-green-600 text-green-600 hover:bg-green-600 hover:text-white btn-lg w-full gap-2 transition-all duration-300"
              id="carritoBtn"
            >
              <i className="fa fa-shopping-cart"></i>
              Ir al carrito
            </a>
            <p className="text-green-600 text-center text-xs mt-2 slide-in">
              ✓ Tu producto ya se encuentra en el carrito
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AddToCartButton;
