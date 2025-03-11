import { React, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './Navigation';
import { AutohideSnackbar } from '../materialUI/Snackbar';
import { addItem } from '../redux/CartReducer';
import PropTypes from 'prop-types';

/**
 * Componente principal de la página de inicio que muestra productos destacados
 * @returns {JSX.Element} Página principal con sección hero y productos destacados
 */
const HomePage = () => {
    // Estado para almacenar los productos destacados
    const [featuredProducts, setFeaturedProducts] = useState([]);

    // Estado para manejar el estado de carga
    const [loading, setLoading] = useState(true);

    // Estado para manejar errores en las peticiones
    const [error, setError] = useState(null);

    // Hook para dispatch de Redux
    const dispatch = useDispatch();

    /**
     * Función asincrónica para obtener productos destacados de la API
     * @async
     * @returns {Promise<void>} 
     * @description Obtiene 3 productos de la API FakeStore para la sección destacada
     */
    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch('https://fakestoreapi.com/products?limit=3');
            if (!response.ok) throw new Error('Error al cargar productos destacados');
            const data = await response.json();
            setFeaturedProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Maneja el agregado de productos al carrito
     * @param {Object} product - Producto a agregar al carrito
     * @description Dispara la acción de Redux para agregar items al carrito
     */
    const handleAddToCart = (product) => {
        dispatch(addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image
        }));
    };

    // Efecto para cargar productos al montar el componente
    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

        return (
            <div className="min-h-screen bg-gray-50 min-w-[320px] overflow-x-hidden">
                <Navbar />

                {/* Hero Section - Optimizada para todos los tamaños */}
                <div className="pt-20 pb-10 bg-gradient-to-b from-blue-600 to-blue-800 
                    sm:pt-24 sm:pb-12 
                    lg:py-28 
                    xl:py-32 
                    2xl:py-40">
                    <div className="max-w-7xl mx-auto px-4 
                        sm:px-6 
                        lg:px-8 
                        xl:max-w-8xl 
                        2xl:max-w-[1800px]">

                        <div className="flex flex-col items-center justify-between gap-6 
                            md:flex-row md:gap-8 
                            lg:gap-12 
                            xl:gap-16">

                            {/* Text Content - Escalado responsive */}
                            <div className="text-white w-full text-center 
                                md:w-1/2 md:text-left 
                                lg:space-y-7 
                                xl:space-y-8">
                                <span className="inline-block bg-white/20 px-3 py-1.5 rounded-full text-xs 
                                    sm:text-sm sm:px-4 sm:py-2 
                                    lg:text-base">
                                    NEW CONCEPT FOR SUMMER
                                </span>
                                <h1 className="text-4xl font-bold leading-tight mt-4 
                                    sm:text-5xl 
                                    lg:text-6xl 
                                    xl:text-7xl 
                                    2xl:text-8xl">
                                    White Snooker <br />
                                    <span className="text-blue-200">Collection</span>
                                </h1>
                                <p className="text-base text-gray-200 mt-3 
                                    sm:text-lg 
                                    lg:text-xl 
                                    xl:text-2xl">
                                    Discover our premium selection of summer essentials
                                </p>
                                <div className="flex justify-center mt-5 
                                    md:justify-start 
                                    lg:mt-8">
                                    <Link
                                        to="/categories"
                                        className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold text-sm 
                                            sm:px-8 sm:py-3 sm:text-base 
                                            lg:px-10 lg:py-4 lg:text-lg 
                                            hover:bg-opacity-90 transition-all"
                                    >
                                        Shop Now
                                    </Link>
                                </div>
                            </div>

                            {/* Featured Image - Ajuste responsive progresivo */}
                            <div className="w-full relative mt-8 
                                md:w-1/2 md:mt-0 
                                lg:w-[55%]">
                                <div className="relative group 
                                    lg:transform lg:translate-x-10 
                                    xl:translate-x-20">
                                    <img
                                        src="https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg"
                                        alt="Featured Product"
                                        className="w-full h-64 object-contain transform 
                                            sm:h-72 
                                            md:h-80 
                                            lg:h-96 
                                            xl:h-[450px] 
                                            2xl:h-[500px] 
                                            group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Best Sellers Section - Grid totalmente responsive */}
                <div className="max-w-7xl mx-auto px-4 
                    sm:px-6 
                    lg:px-8 
                    py-12 
                    sm:py-14 
                    lg:py-16 
                    xl:py-20 
                    2xl:max-w-[1800px]">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center 
                        sm:text-3xl sm:mb-8 
                        lg:text-4xl lg:mb-12 
                        xl:text-5xl">
                        Best Sellers
                    </h2>

                    {loading ? (
                        <div className="text-center text-lg sm:text-xl">Cargando productos...</div>
                    ) : error ? (
                        <AutohideSnackbar message={error} />
                    ) : (
                        <div className="grid grid-cols-1 gap-5 
                            sm:grid-cols-2 sm:gap-6 
                            lg:grid-cols-3 lg:gap-8 
                            xl:gap-10">
                            {featuredProducts.map(product => (
                                <div key={product.id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow 
                                    sm:p-5 
                                    lg:p-6 
                                    xl:p-8">
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden 
                                        sm:mb-4 
                                        lg:mb-5">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-contain hover:scale-110 transition-transform p-3 
                                                sm:p-4 
                                                lg:p-5"
                                        />
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-2 truncate 
                                        sm:text-lg 
                                        lg:text-xl 
                                        xl:text-2xl">
                                        {product.title}
                                    </h3>
                                    <div className="flex justify-between items-center 
                                        sm:text-lg 
                                        lg:text-xl">
                                        <span className="text-blue-600 font-bold text-lg 
                                            sm:text-xl 
                                            lg:text-2xl 
                                            xl:text-3xl">
                                            ${product.price}
                                        </span>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm 
                                                sm:px-4 sm:py-2 sm:text-base 
                                                lg:px-5 lg:py-2.5 lg:text-lg 
                                                hover:bg-blue-600 transition-colors"
                                            aria-label={`Agregar ${product.title} al carrito`}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }


// Validación de propiedades
HomePage.propTypes = {
    /** Array de productos destacados */
    featuredProducts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            image: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired
        })
    )
};

export default HomePage;