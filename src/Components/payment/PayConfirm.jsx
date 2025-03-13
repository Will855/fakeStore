import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartTotal } from '../redux/CartReducer';

/**
 * Componente para mostrar la confirmación del pago exitoso
 * @returns {JSX.Element} Página de confirmación con detalles del pago
 */
const ConfirmacionPago = () => {
    const navigate = useNavigate();
    const totalPagado = useSelector(selectCartTotal);
    
    /**
     * Maneja el retorno a la página principal
     */
    const handleVolverInicio = () => {
        navigate('/');
    };

    return (
        <div className="confirmation-container max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
            <div className="icono-exito mb-6">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-20 w-20 text-green-600 mx-auto" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                ¡Pago Completado Exitosamente!
            </h1>
            
            <div className="detalles-pago mb-8">
                <p className="text-xl text-gray-600 mb-2">
                    Monto pagado: 
                    <span className="font-semibold ml-2 text-blue-600">
                        ${totalPagado.toFixed(2)}
                    </span>
                </p>
                <p className="text-gray-500 text-sm">
                    Recibirás un correo de confirmación con los detalles de tu transacción
                </p>
            </div>

            <div className="acciones">
                <button
                    onClick={handleVolverInicio}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                    Volver al Inicio
                </button>
            </div>

            <div className="mt-8 text-sm text-gray-500 border-t border-gray-200 pt-4">
                <p>¿Necesitas ayuda? Contacta a nuestro soporte: soporte@tienda.com</p>
            </div>
        </div>
    );
};

export default ConfirmacionPago;