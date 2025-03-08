// CartReducer.jsx
import { createSlice, createSelector } from '@reduxjs/toolkit';

/**
 * @typedef {Object} CartState - Estado inicial del carrito
 * @property {Array} items - Lista de productos con sus cantidades
 */
const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        /**
         * Agrega un producto al carrito o incrementa su cantidad
         * @param {CartState} state - Estado actual
         * @param {Object} action - Acción con payload del producto
         */
        addItem: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            existingItem
                ? existingItem.quantity += 1
                : state.items.push({ ...action.payload, quantity: 1 });
        },

        /**
         * Reduce la cantidad o elimina un producto del carrito
         * @param {CartState} state - Estado actual
         * @param {Object} action - Acción con payload del ID
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
         */
        removeAllUnits: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        }
    },
});

// Selectores memoizados para optimizar rendimiento
export const selectCartItems = state => state.cart.items;

export const selectCartItemsCount = createSelector(
    [selectCartItems],
    items => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartTotal = createSelector(
    [selectCartItems],
    items => items.reduce((total, item) => total + (item.price * item.quantity), 0)
);

export const { addItem, removeItem, removeAllUnits } = cartSlice.actions;
export default cartSlice.reducer;

/**
 * @typedef {Object} CartItem
 * @property {number} id - ID único del producto
 * @property {string} title - Nombre del producto
 * @property {number} price - Precio unitario
 * @property {string} image - URL de la imagen
 * @property {number} quantity - Cantidad en el carrito
 */