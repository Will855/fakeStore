'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Navbar() {
  const pathname = usePathname();
  const { cartTotalItems, setIsCartOpen, setIsSearchOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Tienda', href: '/tienda' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-800 group-hover:text-rose-600 transition-colors">
                FAKESTORE<span className="text-rose-500">.VE</span>
              </span>
              <span className="text-[10px] text-rose-400 tracking-wider font-bold uppercase">Boutique Femenina</span>
            </div>
          </Link>

          {/* Links Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-rose-600 font-bold border-b-2 border-rose-500 pb-1'
                      : 'text-slate-600 hover:text-rose-500'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Botones de Acción: Buscar, Carrito, Menú Móvil */}
          <div className="flex items-center space-x-3">
            
            {/* Botón Buscar */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Buscar prendas"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Botón Carrito */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-all flex items-center space-x-2"
              title="Ver carrito de compras"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-bold">Carrito</span>
              {cartTotalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center animate-bounce shadow-md shadow-rose-500/40">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* Toggle Menú Móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-rose-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-rose-100 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                pathname === link.href ? 'bg-rose-50 text-rose-600' : 'text-slate-700 hover:bg-rose-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
