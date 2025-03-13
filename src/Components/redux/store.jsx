
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import cartReducer from './CartReducer';
import logger from 'redux-logger';

/**
 * Carga estado inicial desde localStorage
 * @returns {Object|undefined} Estado pre-cargado o undefined
 */
function loadInitialState() {
    try {
        const serializedState = localStorage.getItem('reduxState');
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (e) {
        console.warn('Error loading state:', e);
        return undefined;
    }
}

/**
 * Guarda estado en localStorage
 * @param {Object} state - Estado actual de Redux
 */
function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('reduxState', serializedState);
    } catch (e) {
        console.warn('Error saving state:', e);
    }
}

const rootReducer = combineReducers({
    cart: cartReducer,
});

/**
 * Store configurado de Redux con persistencia local
 * @type {import('@reduxjs/toolkit').EnhancedStore}
 */
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            ...(process.env.NODE_ENV !== 'production' ? [logger] : [])
        ),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: loadInitialState()
});

// Suscripción para guardar cambios de estado
store.subscribe(() => saveState(store.getState()));

export default store;