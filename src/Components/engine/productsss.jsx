import {React, useState, useEffect }from 'react';
import Navbar from './Navigation';
import { Link } from 'react-router-dom';
import { AutohideSnackbar } from '../materialUI/Snackbar';

const HomePage = () => {

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://fakestoreapi.com/products?limit=3')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar productos destacados');
                return res.json();
            })
            .then(data => {
                setFeaturedProducts(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="pt-24 pb-12 bg-gradient-to-b from-blue-600 to-blue-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                        {/* Text Content */}
                        <div className="text-white md:w-1/2 space-y-6">
                            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                                NEW CONCEPT FOR SUMMER
                            </span>
                            <h1 className="text-5xl font-bold leading-tight">
                                White Snooker <br />
                                <span className="text-blue-200">Collection</span>
                            </h1>
                            <p className="text-lg text-gray-200">
                                Discover our premium selection of summer essentials
                            </p>
                            <div className="flex gap-4">
                                <Link
                                    to="/categories"
                                    className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="md:w-1/2 relative">
                            <div className="relative group">
                                <img
                                    src="https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg"
                                    alt="Featured Product"
                                    className="w-full h-96 object-contain transform group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Best Sellers Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Best Sellers
                </h2>

                {loading ? (
                    <div className="text-center">Cargando productos...</div>
                ) : error ? (
                    <AutohideSnackbar message={error} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredProducts.map(product => (
                            <div key={product.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-contain hover:scale-110 transition-transform p-4"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                                    {product.title}
                                </h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-600 font-bold text-xl">
                                        ${product.price}
                                    </span>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;