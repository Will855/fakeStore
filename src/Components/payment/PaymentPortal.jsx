import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartTotal } from '../redux/CartReducer';
import { Link } from 'react-router-dom';

/**
 * @typedef {Object} PaymentFormData
 * @property {string} nombre - Nombre completo del cliente
 * @property {string} telefono - Número de teléfono de contacto
 * @property {string} referencia - Últimos 4 dígitos de la referencia de pago
 * @property {File|null} comprobante - Archivo del comprobante de pago
 */

/**
 * Componente para gestionar el proceso de pago móvil
 * @returns {JSX.Element} Portal de pago con formulario y datos bancarios
 */
const PaymentPortal = () => {
    const navigate = useNavigate();
    const totalPrice = useSelector(selectCartTotal);
    const [formData, setFormData] = useState(/** @type {PaymentFormData} */({
        nombre: '',
        telefono: '',
        referencia: '',
        comprobante: null
    }));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    /**
     * @typedef {Object} BankDetails
     * @property {string} banco - Nombre de la entidad bancaria
     * @property {string} tipoCuenta - Tipo de cuenta bancaria
     * @property {string} numeroCuenta - Número de cuenta para transferencias
     * @property {string} cedulaTitular - Identificación del titular
     * @property {string} nombreTitular - Nombre del titular de la cuenta
     */
    /** @type {BankDetails} */
    const paymentDetails = {
        banco: 'Banco Nacional Ejemplo',
        tipoCuenta: 'Cuenta Corriente',
        numeroCuenta: '0123-4567-8901-2345',
        cedulaTitular: 'V-12345678',
        nombreTitular: 'Tienda Online S.A.'
    };

    /**
     * Maneja cambios en campos de texto del formulario
     * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Maneja selección de archivo para comprobante
     * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio
     */
    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            comprobante: e.target.files[0]
        }));
    };

    /**
     * Valida los datos del formulario antes del envío
     * @returns {boolean} True si todos los campos son válidos
     */
    const validateForm = () => {
        if (!formData.nombre.trim()) {
            setSubmitError('El nombre es requerido');
            return false;
        }
        if (!/^\d{10,15}$/.test(formData.telefono)) {
            setSubmitError('Teléfono inválido (10-15 dígitos)');
            return false;
        }
        if (!/^\d{4}$/.test(formData.referencia)) {
            setSubmitError('La referencia debe tener 4 dígitos');
            return false;
        }
        if (!formData.comprobante) {
            setSubmitError('Debe subir el comprobante');
            return false;
        }
        return true;
    };

    /**
     * Maneja el envío del formulario al servidor
     * @param {React.FormEvent<HTMLFormElement>} e - Evento de envío
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitError('');

        const payload = new FormData();
        payload.append('monto', totalPrice.toFixed(2));
        payload.append('nombre', formData.nombre);
        payload.append('telefono', formData.telefono);
        payload.append('referencia', formData.referencia);
        payload.append('comprobante', formData.comprobante);

        try {
            const response = await fetch('https://api.tienda.com/pagos', {
                method: 'POST',
                body: payload
            });

            if (!response.ok) throw new Error('Error en el servidor');

            navigate('/confirmacion-pago');
        } catch (error) {
            setSubmitError(error.message || 'Error al enviar comprobante');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="payment-portal max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Portal de Pago</h1>

                <div className="bank-details mb-8 p-4 bg-blue-50 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center">Datos para Transferencia</h2>
                    <div className="space-y-2 text-gray-600">
                        <p className="text-center"><span className="font-medium">Banco:</span> {paymentDetails.banco}</p>
                        <p className="text-center"><span className="font-medium">Tipo de Cuenta:</span> {paymentDetails.tipoCuenta}</p>
                        <p className="text-center"><span className="font-medium">Número de Cuenta:</span> {paymentDetails.numeroCuenta}</p>
                        <p className="text-center"><span className="font-medium">Cédula/RIF:</span> {paymentDetails.cedulaTitular}</p>
                        <p className="text-center"><span className="font-medium">Titular:</span> {paymentDetails.nombreTitular}</p>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-100 rounded text-center">
                        <p className="text-sm text-yellow-800">⚠️ El monto a transferir debe ser exactamente:
                            <span className="font-bold ml-1">${totalPrice.toFixed(2)}</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="payment-form space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono de Contacto
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                            pattern="\d{10,15}"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Últimos 4 Dígitos de la Referencia
                        </label>
                        <input
                            type="text"
                            name="referencia"
                            value={formData.referencia}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                            pattern="\d{4}"
                            maxLength="4"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comprobante de Pago (Imagen/PDF)
                        </label>
                        <input
                            type="file"
                            name="comprobante"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            accept="image/*,.pdf"
                            disabled={isSubmitting}
                        />
                    </div>

                    {submitError && (
                        <div className="text-red-600 text-sm mt-2 text-center">{submitError}</div>
                    )}

                    <div className="mt-6 flex justify-center">
                        <Link
                            to="/confirmacion-pago"
                            className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:text-white'
                        >
                            <span>Enviar Comprobante</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentPortal;


{/* <button
type="submit"
disabled={isSubmitting}
className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
    }`}
>
{isSubmitting ? 'Enviando...' : 'Enviar Comprobante'}
</button> */}


