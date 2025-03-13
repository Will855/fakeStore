
import { createSlice, createSelector } from '@reduxjs/toolkit';

/**
 * @typedef {Object} CartItem
 * @property {number} id - ID único del producto
 * @property {string} title - Nombre del producto
 * @property {number} price - Precio unitario
 * @property {string} image - URL de la imagen
 * @property {number} quantity - Cantidad en el carrito
 */

/**
 * @typedef {Object} CartState
 * @property {CartItem[]} items - Array de productos en el carrito
 */
const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        /**
         * Agrega o incrementa un producto en el carrito
         * @param {CartState} state - Estado actual
         * @param {Object} action - Acción con payload del producto
         * @param {CartItem} action.payload - Producto a agregar
         */
        addItem: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            existingItem
                ? existingItem.quantity += 1
                : state.items.push({ ...action.payload, quantity: 1 });
        },

        /**
         * Reduce o elimina un producto del carrito
         * @param {CartState} state - Estado actual
         * @param {Object} action - Acción con payload del ID
         * @param {number} action.payload - ID del producto a modificar
         */
        removeItem: (state, action) => {
            const itemIndex = state.items.findIndex(item => item.id === action.payload);
            if (itemIndex !== -1) {
                state.items[itemIndex].quantity > 1
                    ? state.items[itemIndex].quantity -= 1
                    : state.items.splice(itemIndex, 1);
            }
        },

        /**
         * Elimina todas las unidades de un producto
         * @param {CartState} state - Estado actual
         * @param {Object} action - Acción con payload del ID
         * @param {number} action.payload - ID del producto a eliminar
         */
        removeAllUnits: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        }
    },
});

// Selectores memoizados
/**
 * Selector para obtener items del carrito
 * @param {Object} state - Estado global
 * @returns {CartItem[]} Array de productos
 */
export const selectCartItems = state => state.cart.items;

/**
 * Calcula cantidad total de items en el carrito
 * @type {import('@reduxjs/toolkit').OutputSelector}
 */
export const selectCartItemsCount = createSelector(
    [selectCartItems],
    items => items.reduce((total, item) => total + item.quantity, 0)
);

/**
 * Calcula total a pagar
 * @type {import('@reduxjs/toolkit').OutputSelector}
 */
export const selectCartTotal = createSelector(
    [selectCartItems],
    items => items.reduce((total, item) => total + (item.price * item.quantity), 0)
);

export const { addItem, removeItem, removeAllUnits } = cartSlice.actions;
export default cartSlice.reducer;