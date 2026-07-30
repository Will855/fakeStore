'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ShoppingBag, Clock, Trash2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatUSD } from '@/lib/utils';

export default function SearchModal() {
  const { products, isSearchOpen, setIsSearchOpen, addToCart } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  // Cargar historial desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fakestore_search_history');
      if (saved) {
        setSearchHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error cargando historial de búsqueda:', e);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const saveToHistory = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const filtered = searchHistory.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      setSearchHistory(updated);
      localStorage.setItem('fakestore_search_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Error guardando en historial:', e);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('fakestore_search_history');
  };

  const filteredProducts = searchTerm.trim() === ''
    ? []
    : products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative max-w-2xl mx-auto bg-white rounded-2xl border border-rose-100 shadow-2xl overflow-hidden text-slate-900">
        
        {/* Input Header */}
        <div className="p-4 border-b border-rose-100 flex items-center space-x-3 bg-white">
          <Search className="w-6 h-6 text-rose-500" />
          <input
            type="text"
            placeholder="Buscar prendas por nombre, categoría o palabra clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                saveToHistory(searchTerm);
              }
            }}
            autoFocus
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-base font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-1"
            >
              Limpiar
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido: Historial o Resultados */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          
          {searchTerm.trim() === '' ? (
            <div className="space-y-4 py-2">
              {searchHistory.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      <span>Búsquedas Recientes</span>
                    </span>
                    <button
                      onClick={clearHistory}
                      className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Borrar Historial</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchTerm(item);
                          saveToHistory(item);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100 transition-colors text-xs font-semibold flex items-center space-x-1"
                      >
                        <Clock className="w-3 h-3 text-rose-400" />
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-400 pt-2">
                <span className="font-semibold text-slate-600 block mb-1">Sugerencias frecuentes:</span>
                <div className="flex flex-wrap gap-2">
                  {['Vestidos', 'Jeans', 'Blusas', 'Carteras', 'Playero'].map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchTerm(sug);
                        saveToHistory(sug);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-medium"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No se encontraron prendas para &quot;<span className="text-slate-900 font-bold">{searchTerm}</span>&quot;
            </div>
          ) : (
            filteredProducts.map(product => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-rose-50/40 border border-slate-200 hover:border-rose-200 transition-colors"
              >
                <Link
                  href={`/producto/${product.id}`}
                  onClick={() => {
                    saveToHistory(searchTerm);
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center space-x-3 flex-1"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-rose-50 flex-shrink-0 border border-slate-100">
                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors">{product.title}</h4>
                    <span className="text-xs text-rose-600 font-bold">{formatUSD(product.priceUSD)}</span>
                    <span className="text-[10px] text-slate-400 ml-2 uppercase font-bold">{product.category}</span>
                  </div>
                </Link>

                <button
                  onClick={() => {
                    saveToHistory(searchTerm);
                    addToCart(product);
                    setIsSearchOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg flex items-center space-x-1 shadow-sm ml-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
