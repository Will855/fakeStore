import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItem, removeItem } from './CartReducer';
import PropTypes from 'prop-types';
import { selectCartItems, selectCartItemsCount, selectCartTotal } from './CartReducer';

/**
 * Componente principal del carrito de compras con funcionalidad completa
 * @returns {JSX.Element} Componente que muestra el contenido del carrito con gestión de cantidades y checkout
 */
const ProductCart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const totalItems = useSelector(selectCartItemsCount);
    const totalPrice = useSelector(selectCartTotal);

    /**
     * Valida la estructura de un producto
     * @param {Object} product - Producto a validar
     * @returns {boolean} True si el producto es válido
     */
    const isValidProduct = (product) => {
        return product?.id && product?.title && product?.price && product?.image;
    };

    /**
     * Maneja el aumento de cantidad de un producto
     * @param {Object} product - Producto a modificar
     */
    const handleAddItem = (product) => {
        if (isValidProduct(product)) {
            dispatch(addItem(product));
        }
    };

    /**
     * Maneja la reducción de cantidad de un producto
     * @param {number} id - ID del producto a modificar
     */
    const handleRemoveItem = (id) => {
        dispatch(removeItem(id));
    };

    return (
        <div className="cart-container p-4 md:p-6 max-w-4xl mx-auto">
            <header className="cart-header mb-6 space-y-3 border-b border-gray-200 pb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">🛒</span>
                    Carrito ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </h1>
                <h2 className="text-lg md:text-xl text-gray-700">
                    Total: <span className="font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                </h2>
            </header>

            <ul className="cart-items space-y-3 mt-4">
                {cartItems.map(product => (
                    <li
                        key={product.id}
                        className="cart-item flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-16 h-16 md:w-20 md:h-20 object-contain mr-4 bg-gray-100 p-2 rounded-lg"
                            onError={(e) => e.target.src = '/placeholder-image.png'}
                        />

                        <div className="item-info flex-1 mr-4">
                            <h3 className="font-medium text-gray-800 text-base md:text-lg line-clamp-2">
                                {product.title}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                                Precio unitario: ${product.price.toFixed(2)}
                            </p>
                            <p className="text-gray-700 text-sm mt-1">
                                Subtotal: ${(product.price * product.quantity).toFixed(2)}
                            </p>
                        </div>

                        <div className="item-controls flex items-center gap-3 bg-gray-100 rounded-full p-1">
                            <button
                                onClick={() => handleRemoveItem(product.id)}
                                className={`quantity-btn w-8 h-8 rounded-full flex items-center justify-center transition-colors
                                    ${product.quantity > 1
                                        ? "bg-white text-gray-600 hover:bg-gray-50 hover:text-red-600"
                                        : "bg-red-100 text-red-600 hover:bg-red-200"}`}
                                aria-label="Reducir cantidad"
                            >
                                -
                            </button>

                            <span className="quantity-display font-medium w-6 text-center text-gray-800">
                                {product.quantity}
                            </span>

                            <button
                                onClick={() => handleAddItem(product)}
                                className="quantity-btn w-8 h-8 rounded-full flex items-center justify-center bg-white text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors"
                                aria-label="Aumentar cantidad"
                            >
                                +
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Sección de checkout */}
            {cartItems.length > 0 && (
                <footer className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-end">
                        <Link
                            to="/portal-pago"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                            <span>Proceder al pago</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </footer>
            )}
        </div>
    );
};

ProductCart.propTypes = {
    cartItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            image: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired
        })
    )
};

export default ProductCart;