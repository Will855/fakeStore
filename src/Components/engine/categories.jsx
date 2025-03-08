// CategoriesPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/CartReducer';
import PropTypes from 'prop-types';

/**
 * Componente principal para mostrar productos con filtro de categorías
 * @returns {JSX.Element} Página de productos con funcionalidad de filtrado y agregado al carrito
 */
const CategoriesPage = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Categorías disponibles (según FakeStore API)
    const categories = [
        'all',
        'electronics',
        'jewelery',
        "men's clothing",
        "women's clothing"
    ];

    /**
     * Obtiene productos de la API según categoría seleccionada
     * @async
     * @returns {Promise<void>}
     */
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const endpoint = selectedCategory === 'all'
                ? 'https://fakestoreapi.com/products'
                : `https://fakestoreapi.com/products/category/${selectedCategory}`;

            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('Error fetching products');

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Maneja el cambio de categoría en el filtro
     * @param {React.ChangeEvent<HTMLSelectElement>} e - Evento de cambio
     */
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    /**
     * Maneja el agregado de productos al carrito
     * @param {Object} product - Producto seleccionado
     */
    const handleAddToCart = (product) => {
        dispatch(addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image
        }));
    };

    // Efecto para cargar productos cuando cambia la categoría
    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    // Renderizado condicional para estados de carga y error
    if (loading) return <div className="text-center py-8">Cargando productos...</div>;
    if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Filtro de categorías */}
            <div className="mb-8 flex justify-center">
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="px-4 py-2 rounded-lg border-2 border-gray-400 bg-white text-gray-800 
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                    transition-all duration-200 shadow-sm hover:border-blue-300"
                >
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="h-48 w-full object-contain mb-4"
                            onError={(e) => e.target.src = '/placeholder-image.png'}
                        />
                        <h3 className="text-lg font-semibold truncate mb-2">{product.title}</h3>
                        <div className="flex justify-between items-center">
                            <p className="text-xl font-bold text-blue-600">
                                ${product.price.toFixed(2)}
                            </p>
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                aria-label={`Agregar ${product.title} al carrito`}
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Validación de propiedades
CategoriesPage.propTypes = {
    /** Array de productos a mostrar */
    products: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            image: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired
        })
    )
};

export default CategoriesPage;