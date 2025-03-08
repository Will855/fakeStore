import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem } from './CartReducer';
import PropTypes from 'prop-types';
import { selectCartItems, selectCartItemsCount, selectCartTotal } from './CartReducer';

/**
 * Componente principal del carrito de compras
 * @returns {JSX.Element} Componente que muestra el contenido del carrito con gestión de cantidades
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
        <div className="cart-container p-6 max-w-4xl mx-auto">
            <header className="cart-header mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    🛒 Carrito ({totalItems} items)
                </h1>
                <h2 className="text-xl text-gray-600">
                    Total: <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </h2>
            </header>

            <ul className="cart-items space-y-4">
                {cartItems.map(product => (
                    <li key={product.id} className="cart-item flex items-center p-4 bg-white rounded-lg shadow-sm">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-16 h-16 object-contain mr-4"
                            onError={(e) => e.target.src = '/placeholder-image.png'}
                        />

                        <div className="item-info flex-1">
                            <h3 className="font-medium text-gray-800">{product.title}</h3>
                            <p className="text-gray-600">
                                Precio unitario: ${product.price.toFixed(2)}
                            </p>
                        </div>

                        <div className="item-controls flex items-center gap-4">
                            <button
                                onClick={() => handleRemoveItem(product.id)}
                                className="quantity-btn bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200"
                                aria-label="Reducir cantidad"
                            >
                                -
                            </button>

                            <span className="quantity-display text-lg font-medium">
                                {product.quantity}
                            </span>

                            <button
                                onClick={() => handleAddItem(product)}
                                className="quantity-btn bg-green-100 text-green-600 px-3 py-1 rounded-lg hover:bg-green-200"
                                aria-label="Aumentar cantidad"
                            >
                                +
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
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