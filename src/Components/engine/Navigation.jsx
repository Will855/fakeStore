import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { selectCartItemsCount } from '../redux/CartReducer';

/**
 * Componente de navegación principal con carrito interactivo
 * @returns {JSX.Element} Barra de navegación responsive con menú y contador
 */
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cartItemsCount = useSelector(selectCartItemsCount);

    // Estilos dinámicos para enlaces activos
    const getNavLinkStyle = ({ isActive }) =>
        `text-gray-100 hover:text-white transition-colors duration-200 ${isActive ? 'text-white font-semibold border-b-2 border-white' : ''
        }`;

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo y menú móvil */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-white">
                            MyStore
                        </Link>
                    </div>

                    {/* Menú desktop */}
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-md transition-all duration-300 ${isActive
                                    ? 'text-white font-medium bg-blue-700/20 border-b-2 border-blue-300'
                                    : 'text-gray-200 hover:text-white hover:bg-blue-700/10'
                                }`
                            }
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/categories"
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-md transition-all duration-300 ${isActive
                                    ? 'text-white font-medium bg-blue-700/20 border-b-2 border-blue-300'
                                    : 'text-gray-200 hover:text-white hover:bg-blue-700/10'
                                }`
                            }
                        >
                            Categories
                        </NavLink>

                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-md transition-all duration-300 ${isActive
                                    ? 'text-white font-medium bg-blue-700/20 border-b-2 border-blue-300'
                                    : 'text-gray-200 hover:text-white hover:bg-blue-700/10'
                                }`
                            }
                        >
                            Contact
                        </NavLink>
                    </div>

                    {/* Carrito y menú móvil */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/cart"
                            className="relative text-white hover:text-blue-200 transition-colors"
                            aria-label="Ver carrito de compras"
                        >
                            <ShoppingCartIcon className="h-6 w-6" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>

                        {/* Botón menú móvil */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden text-white focus:outline-none"
                            aria-label="Alternar menú móvil"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Menú móvil desplegable */}
                {isMenuOpen && (
                    <div className="md:hidden bg-blue-700/10 backdrop-blur-sm rounded-lg mx-4 mt-2 py-3 space-y-3">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `block px-4 py-3 mx-2 rounded-lg transition-all duration-300 ${isActive
                                    ? 'text-white font-semibold bg-blue-600 border-l-4 border-blue-300'
                                    : 'text-gray-200 hover:bg-blue-700/20'
                                }`
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/categories"
                            className={({ isActive }) =>
                                `block px-4 py-3 mx-2 rounded-lg transition-all duration-300 ${isActive
                                    ? 'text-white font-semibold bg-blue-600 border-l-4 border-blue-300'
                                    : 'text-gray-200 hover:bg-blue-700/20'
                                }`
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Categories
                        </NavLink>

                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                `block px-4 py-3 mx-2 rounded-lg transition-all duration-300 ${isActive
                                    ? 'text-white font-semibold bg-blue-600 border-l-4 border-blue-300'
                                    : 'text-gray-200 hover:bg-blue-700/20'
                                }`
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;