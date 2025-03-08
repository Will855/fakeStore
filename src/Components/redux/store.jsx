// store.jsx
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import cartReducer from './CartReducer';
import logger from 'redux-logger'; // Opcional

// Combina reducers para escalabilidad
const rootReducer = combineReducers({
    cart: cartReducer,
    // Agrega aquí otros reducers futuros
});

// Configuración del store con Redux Toolkit
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Desactiva si no usas acciones no serializables
        }).concat(
            ...(process.env.NODE_ENV !== 'production' ? [logger] : []) // Logger solo en desarrollo
        ),
    devTools: process.env.NODE_ENV !== 'production', // DevTools solo en desarrollo
    // Opcional: Estado inicial pre-cargado
    preloadedState: loadInitialState()
});

// Función para cargar estado desde localStorage (opcional)
function loadInitialState() {
    try {
        const serializedState = localStorage.getItem('reduxState');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (e) {
        console.warn('Error loading state from localStorage:', e);
        return undefined;
    }
}

// Función para guardar estado en localStorage (opcional)
function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('reduxState', serializedState);
    } catch (e) {
        console.warn('Error saving state to localStorage:', e);
    }
}

// Suscribir para guardar cambios (opcional)
store.subscribe(() => {
    saveState(store.getState());
});

export default store;