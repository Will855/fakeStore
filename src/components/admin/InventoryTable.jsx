'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  Edit2, Trash2, Plus, Minus, Search, SlidersHorizontal, ChevronDown, 
  LayoutGrid, List, Filter, Tag, X, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatUSD, formatVES } from '@/lib/utils';

export default function InventoryTable({ onEditProduct }) {
  const { products, updateStock, deleteProduct, bcvRate, categories: cmsCategories } = useStore();

  // Estados de Filtros Admin
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedTag, setSelectedTag] = useState('todos'); // 'todos', 'new', 'featured', 'offer'
  const [selectedStockFilter, setSelectedStockFilter] = useState('todos'); // 'todos', 'in-stock', 'low-stock', 'out-of-stock'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('destacados'); // 'destacados', 'stock-menor', 'stock-mayor', 'precio-menor', 'precio-mayor', 'nombre-az'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const categories = useMemo(() => [
    { id: 'todas', name: 'Todas las Categorías' },
    ...cmsCategories
  ], [cmsCategories]);

  // Filtrado y Ordenamiento del Inventario Admin
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Categoría
        const matchesCat = selectedCategory === 'todas' || p.category === selectedCategory;

        // Etiquetas
        let matchesTag = true;
        if (selectedTag === 'new') matchesTag = !!p.isNew;
        if (selectedTag === 'featured') matchesTag = !!p.isFeatured;
        if (selectedTag === 'offer') matchesTag = !!p.isOffer;

        // Stock
        let matchesStock = true;
        if (selectedStockFilter === 'in-stock') matchesStock = p.stock > 0;
        if (selectedStockFilter === 'low-stock') matchesStock = p.stock <= 3 && p.stock > 0;
        if (selectedStockFilter === 'out-of-stock') matchesStock = p.stock <= 0;

        // Búsqueda SKU o Título
        const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCat && matchesTag && matchesStock && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'stock-menor') return a.stock - b.stock;
        if (sortBy === 'stock-mayor') return b.stock - a.stock;
        if (sortBy === 'precio-menor') return a.priceUSD - b.priceUSD;
        if (sortBy === 'precio-mayor') return b.priceUSD - a.priceUSD;
        if (sortBy === 'nombre-az') return a.title.localeCompare(b.title);
        return b.isFeatured ? 1 : -1;
      });
  }, [products, selectedCategory, selectedTag, selectedStockFilter, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('todas');
    setSelectedTag('todos');
    setSelectedStockFilter('todos');
    setSearchQuery('');
    setSortBy('destacados');
  };

  return (
    <div className="space-y-4 text-xs">
      
      {/* BARRA DE FILTROS Y BÚSQUEDA DEL INVENTARIO (ADMIN) */}
      <div className="bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-zinc-800 space-y-4 shadow-xl">
        
        {/* Fila 1: Píldoras de Categorías */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Fila 2: Sub-filtros por Etiqueta y Disponibilidad de Stock */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
          
          {/* Etiquetas */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1 mr-1">
              <Tag className="w-3 h-3 text-rose-400" />
              <span>Etiqueta:</span>
            </span>
            {[
              { id: 'todos', label: 'Todas' },
              { id: 'new', label: 'Nuevos' },
              { id: 'featured', label: 'Destacados' },
              { id: 'offer', label: 'Ofertas (% OFF)' },
            ].map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedTag === tag.id
                    ? 'bg-rose-500 text-white'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Filtros por Estado de Stock */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1 mr-1">
              <Filter className="w-3 h-3 text-rose-400" />
              <span>Stock:</span>
            </span>
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'in-stock', label: 'En Stock (>0)' },
              { id: 'low-stock', label: 'Pocos (<=3)' },
              { id: 'out-of-stock', label: 'Agotados (0)' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStockFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedStockFilter === st.id
                    ? 'bg-rose-500 text-white'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

        </div>

        {/* Fila 3: Buscador, Selector de Orden y Selector de Vista (Tabla vs Rejilla) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-zinc-800">
          
          {/* Campo de Búsqueda */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por SKU, nombre de prenda o palabra clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-zinc-500 font-medium focus:border-rose-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Ordenamiento por Stock/Precio/Nombre */}
          <div className="relative flex items-center bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-300 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-rose-400 flex-shrink-0 mr-2" />
            <span className="text-zinc-500 font-bold hidden sm:inline mr-1">Ordenar:</span>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-transparent outline-none border-none focus:outline-none focus:ring-0 text-white font-bold text-xs pr-6 cursor-pointer w-full"
            >
              <option value="destacados" className="bg-zinc-900">Recomendados / Top</option>
              <option value="stock-menor" className="bg-zinc-900">Stock: Menor a Mayor (Crítico)</option>
              <option value="stock-mayor" className="bg-zinc-900">Stock: Mayor a Menor</option>
              <option value="precio-menor" className="bg-zinc-900">Precio: Menor a Mayor</option>
              <option value="precio-mayor" className="bg-zinc-900">Precio: Mayor a Menor</option>
              <option value="nombre-az" className="bg-zinc-900">Nombre (A-Z)</option>
            </select>
            
            <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-3 pointer-events-none" />
          </div>

          {/* Toggle de Vista Tabla (List) vs Rejilla (Grid) */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 p-1 rounded-xl w-full sm:w-auto justify-end">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all flex items-center space-x-1 text-xs font-bold ${
                viewMode === 'table'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Vista en Tabla (Lista)"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Tabla</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all flex items-center space-x-1 text-xs font-bold ${
                viewMode === 'grid'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Vista en Tarjetas (Rejilla)"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Rejilla</span>
            </button>
          </div>

        </div>

        {/* Resumen de resultados */}
        <div className="flex justify-between items-center text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
          <span>Mostrando <strong className="text-white">{filteredProducts.length}</strong> de {products.length} productos en inventario</span>
          {(selectedCategory !== 'todas' || selectedTag !== 'todos' || selectedStockFilter !== 'todos' || searchQuery) && (
            <button onClick={resetFilters} className="text-rose-400 font-bold underline hover:text-rose-300">
              Limpiar Filtros
            </button>
          )}
        </div>

      </div>

      {/* CONTENIDO DEL INVENTARIO (VISTA TABLA O VISTA REJILLA) */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-zinc-900 rounded-2xl border border-zinc-800 space-y-3">
          <p className="text-zinc-300 font-bold text-sm">No se encontraron productos con estos criterios de búsqueda.</p>
          <button onClick={resetFilters} className="text-xs text-rose-400 font-bold underline hover:text-rose-300">
            Restablecer Filtros del Inventario
          </button>
        </div>
      ) : viewMode === 'table' ? (
        
        /* VISTA EN TABLA / LISTA */
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-300 font-extrabold border-b border-zinc-800 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Producto</th>
                  <th className="p-4">SKU / Categoría</th>
                  <th className="p-4">Precio (USD / Bs)</th>
                  <th className="p-4">Stock Disponible</th>
                  <th className="p-4">Etiquetas</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-800/60 transition-colors">
                    
                    {/* Producto */}
                    <td className="p-4 flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0 border border-zinc-800">
                        <Image src={product.image} alt={product.title} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-1">{product.title}</h4>
                        <span className="text-[11px] text-zinc-400 line-clamp-1">{product.description}</span>
                      </div>
                    </td>

                    {/* SKU / Categoría */}
                    <td className="p-4">
                      <p className="font-mono text-emerald-400 font-bold">{product.sku}</p>
                      <p className="text-[10px] uppercase text-zinc-400 font-bold">{product.category}</p>
                    </td>

                    {/* Precio */}
                    <td className="p-4">
                      <p className="font-black text-white">{formatUSD(product.priceUSD)}</p>
                      <p className="text-[10px] text-rose-400 font-semibold">{formatVES(product.priceUSD * bcvRate)}</p>
                    </td>

                    {/* Stock con Control +/- */}
                    <td className="p-4">
                      <div className="inline-flex items-center space-x-2 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5">
                        <button
                          onClick={() => updateStock(product.id, product.stock - 1)}
                          className="text-zinc-400 hover:text-rose-400 p-0.5"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className={`font-mono font-bold w-6 text-center text-xs ${
                          product.stock <= 0
                            ? 'text-rose-400 font-black'
                            : product.stock <= 3
                            ? 'text-amber-400 font-black animate-pulse'
                            : 'text-white'
                        }`}>
                          {product.stock}
                        </span>
                        <button
                          onClick={() => updateStock(product.id, product.stock + 1)}
                          className="text-zinc-400 hover:text-emerald-400 p-0.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Badges */}
                    <td className="p-4 space-x-1 space-y-1">
                      {product.isNew && (
                        <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                          Nuevo
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="inline-block bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                          Top
                        </span>
                      )}
                      {product.isOffer && (
                        <span className="inline-block bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                          -{product.discountPercentage}% OFF
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg border border-zinc-700"
                        title="Editar producto"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Seguro que deseas eliminar "${product.title}"?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-zinc-800"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      ) : (

        /* VISTA EN REJILLA (GRID) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all shadow-md group"
            >
              <div>
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 mb-3">
                  <Image src={product.image} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  
                  <span className="absolute top-2 left-2 bg-zinc-950/80 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800 backdrop-blur-sm">
                    {product.sku}
                  </span>

                  {product.stock <= 3 && product.stock > 0 && (
                    <span className="absolute top-2 right-2 bg-amber-500/90 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow">
                      Pocos ({product.stock})
                    </span>
                  )}
                  {product.stock <= 0 && (
                    <span className="absolute top-2 right-2 bg-rose-500/90 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow">
                      Agotado
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] uppercase font-bold text-rose-400">{product.category}</span>
                  <div className="flex items-center space-x-1">
                    {product.isNew && <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 rounded">Nuevo</span>}
                    {product.isFeatured && <span className="bg-amber-500/20 text-amber-400 text-[9px] font-bold px-1.5 rounded">Top</span>}
                    {product.isOffer && <span className="bg-rose-500/20 text-rose-400 text-[9px] font-bold px-1.5 rounded">-{product.discountPercentage}%</span>}
                  </div>
                </div>

                <h4 className="font-bold text-white text-sm line-clamp-1">{product.title}</h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{product.description}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-base font-black text-white">{formatUSD(product.priceUSD)}</p>
                  <p className="text-[10px] text-rose-400 font-semibold">{formatVES(product.priceUSD * bcvRate)}</p>
                </div>

                {/* Stock Counter + Acciones */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1">
                    <button onClick={() => updateStock(product.id, product.stock - 1)} className="text-zinc-400 hover:text-rose-400">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold w-5 text-center text-white text-xs">{product.stock}</span>
                    <button onClick={() => updateStock(product.id, product.stock + 1)} className="text-zinc-400 hover:text-emerald-400">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onEditProduct(product)}
                    className="p-2 text-zinc-300 hover:text-white bg-zinc-800 rounded-lg border border-zinc-700"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`¿Seguro que deseas eliminar "${product.title}"?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="p-2 text-zinc-400 hover:text-rose-400 bg-rose-500/10 rounded-lg border border-rose-500/20"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      )}

    </div>
  );
}
