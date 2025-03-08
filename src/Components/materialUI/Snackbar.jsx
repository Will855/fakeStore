import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/CartReducer';

/**
 * Componente Snackbar para notificaciones de compra con autocierre
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.product - Producto a agregar al carrito
 * @returns {JSX.Element} Componente con botón de compra y notificación
 */
export const AutohideSnackbar = ({ product }) => {
    // Hooks de estado y Redux
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);

    // Mensaje dinámico para la notificación
    const notificationMessage = `"${product.title}" agregado al carrito`;

    /**
     * Maneja el clic en el botón de compra:
     * - Muestra la notificación
     * - Agrega el producto al carrito
     */
    const handlePurchaseClick = () => {
        setOpen(true); // Activa la visualización del Snackbar
        dispatch(addItem(product)); // Dispara acción de Redux
    };

    /**
     * Maneja el cierre de la notificación:
     * @param {Event} event - Evento de cierre
     * @param {string} reason - Razón del cierre (tiempo o interacción)
     */
    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') return; // Ignora cierres por clic externo
        setOpen(false); // Actualiza estado para ocultar Snackbar
    };

    return (
        <div className="snackbar-container">
            {/* Botón principal de compra */}
            <Button
                variant="contained"
                color="primary"
                onClick={handlePurchaseClick}
                aria-label={`Agregar ${product.title} al carrito`}
                data-testid="buy-button"
            >
                Comprar
            </Button>

            {/* Componente de notificación temporal */}
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleNotificationClose}
                message={notificationMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transitionDuration={{ enter: 300, exit: 150 }}
            />
        </div>
    );
};

// Validación de propiedades
AutohideSnackbar.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
    }).isRequired
};

export default AutohideSnackbar;