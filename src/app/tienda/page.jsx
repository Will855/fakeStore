'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ShoppingBag, Search, SlidersHorizontal, X, ChevronDown, 
  LayoutGrid, List, Filter, CheckCircle2, ShieldAlert, Tag
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatUSD, formatVES } from '@/lib/utils';

function TiendaContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'todas';

  const { products, addToCart, bcvRate, categories: cmsCategories } = useStore();

  // Estados de Filtro y Visualización
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTag, setSelectedTag] = useState('todos'); // 'todos', 'new', 'featured', 'offer'
  const [selectedStockFilter, setSelectedStockFilter] = useState('todos'); // 'todos', 'in-stock', 'low-stock'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('destacados');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const categories = useMemo(() => [
    { id: 'todas', name: 'Todas las Prendas' },
    ...cmsCategories
  ], [cmsCategories]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Filtro Categoría
        const matchesCat = selectedCategory === 'todas' || p.category === selectedCategory;

        // Filtro Etiquetas
        let matchesTag = true;
        if (selectedTag === 'new') matchesTag = !!p.isNew;
        if (selectedTag === 'featured') matchesTag = !!p.isFeatured;
        if (selectedTag === 'offer') matchesTag = !!p.isOffer;

        // Filtro Stock
        let matchesStock = true;
        if (selectedStockFilter === 'in-stock') matchesStock = p.stock > 0;
        if (selectedStockFilter === 'low-stock') matchesStock = p.stock <= 3 && p.stock > 0;

        // Filtro Búsqueda
        const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCat && matchesTag && matchesStock && matchesQuery;
      })
      .sort((a, b) => {
        const effectivePriceA = a.isOffer && a.discountPercentage > 0 ? a.priceUSD * (1 - a.discountPercentage / 100) : a.priceUSD;
        const effectivePriceB = b.isOffer && b.discountPercentage > 0 ? b.priceUSD * (1 - b.discountPercentage / 100) : b.priceUSD;

        if (sortBy === 'precio-menor') return effectivePriceA - effectivePriceB;
        if (sortBy === 'precio-mayor') return effectivePriceB - effectivePriceA;
        if (sortBy === 'stock-mayor') return b.stock - a.stock;
        if (sortBy === 'descuento-mayor') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        return b.isFeatured ? 1 : -1;
      });
  }, [products, selectedCategory, selectedTag, selectedStockFilter, searchQuery, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategory('todas');
    setSelectedTag('todos');
    setSelectedStockFilter('todos');
    setSearchQuery('');
    setSortBy('destacados');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Encabezado Catálogo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-rose-100/80 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-1 block">
            Catálogo Exclusivo
          </span>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Colección Femenina
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-rose-50/60 border border-rose-100 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center space-x-2">
            <span>Mostrando</span>
            <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[11px] font-black">
              {filteredProducts.length}
            </span>
            <span>prendas disponibles</span>
          </div>

          {/* Toggle de Vista Grid vs List */}
          <div className="flex items-center bg-rose-50/60 border border-rose-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Vista en Rejilla (Grid)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Vista en Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Panel Superior de Filtros Organizados */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-100 shadow-xl shadow-rose-500/5 space-y-4">
        
        {/* Fila 1: Píldoras de Categorías */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-[1.02]'
                    : 'bg-rose-50/50 text-slate-700 hover:bg-rose-100/60 hover:text-rose-600 border border-rose-100'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Fila 2: Sub-filtros por Etiqueta y Stock */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-rose-100/60 text-xs">
          
          {/* Filtros por Etiqueta */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1 mr-1">
              <Tag className="w-3 h-3 text-rose-500" />
              <span>Etiqueta:</span>
            </span>
            {[
              { id: 'todos', label: 'Todas' },
              { id: 'new', label: 'Nuevos' },
              { id: 'featured', label: 'Destacados (Top)' },
              { id: 'offer', label: 'Ofertas (% OFF)' },
            ].map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedTag === tag.id
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-rose-50/40 text-slate-600 border border-rose-100 hover:border-rose-200'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Filtros por Disponibilidad de Stock */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1 mr-1">
              <Filter className="w-3 h-3 text-rose-500" />
              <span>Stock:</span>
            </span>
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'in-stock', label: 'En Stock' },
              { id: 'low-stock', label: 'Pocos en Tienda' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStockFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedStockFilter === st.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-rose-50/40 text-slate-600 border border-rose-100 hover:border-rose-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

        </div>

        {/* Fila 3: Buscador e Input de Ordenamiento */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-rose-100/60">
          
          {/* Campo de Búsqueda */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por prenda, código SKU o palabra clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-rose-50/20 border border-rose-100/80 rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:border-rose-400 focus:bg-white focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Selector de Ordenamiento */}
          <div className="relative flex items-center bg-rose-50/20 border border-rose-100/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-rose-500 flex-shrink-0 mr-2" />
            <span className="text-slate-400 font-medium hidden sm:inline mr-1">Ordenar:</span>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-transparent outline-none border-none focus:outline-none focus:ring-0 text-slate-900 font-bold text-xs pr-6 cursor-pointer w-full"
            >
              <option value="destacados">Recomendados / Destacados</option>
              <option value="precio-menor">Precio: Menor a Mayor</option>
              <option value="precio-mayor">Precio: Mayor a Menor</option>
              <option value="stock-mayor">Mayor Disponibilidad de Stock</option>
              <option value="descuento-mayor">Mayor Descuento (% OFF)</option>
            </select>
            
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
          </div>

        </div>

      </div>

      {/* Listado de Productos (Vista Grid o Vista Lista) */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-rose-100 space-y-3">
          <p className="text-slate-600 font-semibold text-base">No se encontraron prendas con los filtros aplicados.</p>
          <button
            onClick={resetAllFilters}
            className="text-xs text-rose-600 font-bold underline hover:text-rose-700"
          >
            Restablecer Todos los Filtros
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* VISTA REJILLA (GRID) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const effectivePrice = product.isOffer && product.discountPercentage > 0
              ? product.priceUSD * (1 - product.discountPercentage / 100)
              : product.priceUSD;

            return (
              <div
                key={product.id}
                className="bg-white border border-rose-100 rounded-2xl p-5 flex flex-col justify-between hover:border-rose-300 hover:shadow-xl hover:shadow-rose-500/5 transition-all group"
              >
                <div>
                  <Link href={`/producto/${product.id}`} className="block relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-rose-50/50">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isOffer && (
                      <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-sm">
                        -{product.discountPercentage}% OFF
                      </span>
                    )}
                    {product.stock <= 3 && product.stock > 0 && (
                      <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-sm">
                        Pocos ({product.stock})
                      </span>
                    )}
                  </Link>

                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-rose-500 uppercase font-bold tracking-wider">{product.category}</span>
                    {product.isFeatured && (
                      <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200/80">
                        Top
                      </span>
                    )}
                  </div>

                  <Link href={`/producto/${product.id}`} className="block hover:text-rose-600 transition-colors">
                    <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">{product.title}</h3>
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{product.description}</p>
                </div>

                <div className="pt-4 border-t border-rose-100/60 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-slate-900">{formatUSD(effectivePrice)}</p>
                    <p className="text-xs text-rose-600 font-semibold">{formatVES(effectivePrice * bcvRate)}</p>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
                      product.stock <= 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{product.stock <= 0 ? 'Agotado' : 'Agregar'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISTA LISTA (LIST) */
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const effectivePrice = product.isOffer && product.discountPercentage > 0
              ? product.priceUSD * (1 - product.discountPercentage / 100)
              : product.priceUSD;

            return (
              <div
                key={product.id}
                className="bg-white border border-rose-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-5 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-500/5 transition-all group"
              >
                {/* Foto e Información Principal */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <Link href={`/producto/${product.id}`} className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-rose-50/50 flex-shrink-0">
                    <Image src={product.image} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider">
                      <span className="text-rose-500">{product.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400 font-mono">SKU: {product.sku}</span>
                    </div>

                    <Link href={`/producto/${product.id}`} className="block hover:text-rose-600 transition-colors">
                      <h3 className="text-base font-bold text-slate-900">{product.title}</h3>
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 max-w-md">{product.description}</p>

                    {/* Badges */}
                    <div className="flex items-center space-x-1.5 pt-1">
                      {product.isNew && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                          Nuevo
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200">
                          Top
                        </span>
                      )}
                      {product.isOffer && (
                        <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200">
                          -{product.discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stock y Precio / Acciones */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-rose-100">
                  <div className="text-left sm:text-right mb-0 sm:mb-3">
                    <div className="flex items-center sm:justify-end space-x-2">
                      <span className="text-xl font-black text-slate-900">{formatUSD(effectivePrice)}</span>
                      {product.isOffer && (
                        <span className="text-xs text-slate-400 line-through">{formatUSD(product.priceUSD)}</span>
                      )}
                    </div>
                    <p className="text-xs text-rose-600 font-semibold">{formatVES(effectivePrice * bcvRate)}</p>

                    {/* Stock Indicator */}
                    <p className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center space-x-1 justify-start sm:justify-end">
                      {product.stock > 0 ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Stock: <strong className="text-slate-900">{product.stock} unid.</strong></span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3 h-3 text-rose-500" />
                          <span className="text-rose-500 font-bold">Agotado</span>
                        </>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
                      product.stock <= 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-95'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{product.stock <= 0 ? 'Agotado' : 'Agregar'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TiendaPage() {
  return (
    <div className="py-6 bg-gradient-to-b from-rose-50/20 via-white to-white min-h-screen">
      <Suspense fallback={
        <div className="py-20 text-center text-slate-500 text-sm">Cargando catálogo...</div>
      }>
        <TiendaContent />
      </Suspense>
    </div>
  );
}
