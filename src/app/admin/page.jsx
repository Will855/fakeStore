'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Package, Plus, Settings, ShieldAlert, DollarSign, 
  ArrowUp, ArrowDown, Eye, EyeOff, Layers, Sparkles, Tag, Save, Trash2, Edit3 
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import InventoryTable from '@/components/admin/InventoryTable';
import ProductFormModal from '@/components/admin/ProductFormModal';

export default function AdminPage() {
  const { 
    products, 
    bcvRate, 
    setBcvRate, 
    ownerPhone, 
    setOwnerPhone,
    categories,
    updateCategories,
    homeSections,
    updateHomeSections,
    heroConfig,
    updateHeroConfig,
    footerConfig,
    updateFooterConfig
  } = useStore();

  const [activeTab, setActiveTab] = useState('inventory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Estados locales de formulaciones Admin
  const [tempRate, setTempRate] = useState(bcvRate);
  const [tempPhone, setTempPhone] = useState(ownerPhone);
  const [tempHero, setTempHero] = useState(heroConfig);
  const [tempFooter, setTempFooter] = useState(footerConfig);

  // Estado para gestión de categorías
  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState(null);

  const lowStockCount = products.filter(p => p.stock <= 3 && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Mover sección arriba
  const moveSectionUp = (index) => {
    if (index === 0) return;
    const updated = [...homeSections];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    updateHomeSections(updated);
  };

  // Mover sección abajo
  const moveSectionDown = (index) => {
    if (index === homeSections.length - 1) return;
    const updated = [...homeSections];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    updateHomeSections(updated);
  };

  // Alternar visibilidad (Toggle ON/OFF)
  const toggleSectionVisibility = (index) => {
    const updated = [...homeSections];
    updated[index].visible = !updated[index].visible;
    updateHomeSections(updated);
  };

  // Agregar categoría nueva
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const catId = newCatName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCategory = { id: catId, name: newCatName.trim() };
    updateCategories([...categories, newCategory]);
    setNewCatName('');
  };

  // Editar categoría existente
  const handleSaveCategoryEdit = (id, newName) => {
    const updated = categories.map(c => c.id === id ? { ...c, name: newName } : c);
    updateCategories(updated);
    setEditingCat(null);
  };

  // Eliminar categoría
  const handleDeleteCategory = (id) => {
    if (categories.length <= 1) {
      alert('Debes mantener al menos una categoría.');
      return;
    }
    if (confirm('¿Seguro que deseas eliminar esta categoría?')) {
      updateCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="py-10 bg-zinc-950 min-h-screen text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
          <div>
            <span className="text-xs font-extrabold text-rose-400 uppercase tracking-widest">PANEL DE CONTROL CMS</span>
            <h1 className="text-3xl font-black text-white mt-1">Administrador de la Boutique</h1>
          </div>

          {activeTab === 'inventory' && (
            <button
              onClick={handleOpenCreate}
              className="px-5 py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-xl shadow-lg shadow-rose-500/20 flex items-center space-x-2 text-sm transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Nuevo Producto</span>
            </button>
          )}
        </div>

        {/* Pestañas de Navegación Admin */}
        <div className="flex items-center space-x-2 border-b border-zinc-800 overflow-x-auto pb-3">
          {[
            { id: 'inventory', label: 'Inventario & Productos', icon: Package },
            { id: 'sections', label: 'Orden de Secciones', icon: Layers },
            { id: 'hero', label: 'Hero & Textos Tienda', icon: Sparkles },
            { id: 'categories', label: 'Categorías', icon: Tag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* PESTAÑA 1: INVENTARIO & PRODUCTOS */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">
            {/* Métricas de Resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 flex items-center space-x-4">
                <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Total Productos</p>
                  <p className="text-2xl font-black text-white">{products.length}</p>
                </div>
              </div>

              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 flex items-center space-x-4">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Pocos en Stock (&lt;=3)</p>
                  <p className="text-2xl font-black text-amber-400">{lowStockCount}</p>
                </div>
              </div>

              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 flex items-center space-x-4">
                <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Agotados</p>
                  <p className="text-2xl font-black text-rose-400">{outOfStockCount}</p>
                </div>
              </div>

              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Tasa BCV Activa</p>
                  <p className="text-xl font-black text-emerald-400">{bcvRate.toFixed(2)} Bs./$</p>
                </div>
              </div>

            </div>

            {/* Ajustes de Configuración Rápidos */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Settings className="w-4 h-4 text-rose-400" />
                <span>Configuración Rápida del Negocio</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Ajuste Tasa BCV */}
                <div className="space-y-2">
                  <label className="block text-zinc-300 font-bold">Ajustar Tasa BCV del Día (Bs./$)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="0.1"
                      value={tempRate}
                      onChange={(e) => setTempRate(e.target.value)}
                      className="bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white w-full font-bold focus:border-rose-400 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const r = parseFloat(tempRate);
                        if (r > 0) {
                          setBcvRate(r);
                          alert(`Tasa BCV actualizada a ${r} Bs./$`);
                        }
                      }}
                      className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors shadow-md"
                    >
                      Guardar
                    </button>
                  </div>
                </div>

                {/* Ajuste Teléfono WhatsApp */}
                <div className="space-y-2">
                  <label className="block text-zinc-300 font-bold">Número de WhatsApp del Dueño (para recibir órdenes)</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      placeholder="+584141234567"
                      className="bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white w-full font-mono focus:border-rose-400 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        setOwnerPhone(tempPhone);
                        alert(`WhatsApp del dueño actualizado a ${tempPhone}`);
                      }}
                      className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors shadow-md"
                    >
                      Guardar
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Tabla de Inventario */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Catálogo de Productos</h3>
              <InventoryTable onEditProduct={handleOpenEdit} />
            </div>
          </div>
        )}

        {/* PESTAÑA 2: ORDEN Y VISIBILIDAD DE SECCIONES (HOME) */}
        {activeTab === 'sections' && (
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Gestor de Secciones de la Página Principal</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Reordena la posición de las secciones del Inicio con los botones Arriba/Abajo o presiona el ojo para Ocultar/Mostrar secciones en vivo.
              </p>
            </div>

            <div className="space-y-3">
              {homeSections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    sec.visible
                      ? 'bg-zinc-950 border-zinc-800 text-white'
                      : 'bg-zinc-950/40 border-zinc-900 text-zinc-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-black flex items-center justify-center border border-rose-500/30">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold">{sec.name}</h4>
                      <span className="text-[10px] text-zinc-400">
                        Estado: <strong className={sec.visible ? 'text-emerald-400' : 'text-rose-400'}>{sec.visible ? 'VISIBLE' : 'OCULTO'}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveSectionUp(idx)}
                      disabled={idx === 0}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mover arriba"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => moveSectionDown(idx)}
                      disabled={idx === homeSections.length - 1}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Mover abajo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleSectionVisibility(idx)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                        sec.visible
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-zinc-950'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white'
                      }`}
                    >
                      {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{sec.visible ? 'Visible' : 'Oculto'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA 3: HERO & TEXTOS DE LA TIENDA CON PREVISUALIZACIÓN EN VIVO */}
        {activeTab === 'hero' && (
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Editar Hero Section y Pie de Página</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Personaliza las frases, titular Serif, descripción e imagen de fondo del Hero Banner y observa los cambios en vivo antes de guardar.
              </p>
            </div>

            {/* PREVISUALIZACIÓN EN VIVO DEL HERO BANNER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-rose-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <Eye className="w-4 h-4 text-rose-400" />
                  <span>Previsualización en Vivo del Hero Banner</span>
                </span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/30 font-bold">
                  EN TIEMPO REAL
                </span>
              </div>

              <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl flex items-center justify-center bg-zinc-950">
                <Image
                  src={tempHero.bgImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85"}
                  alt="Previsualización Hero"
                  fill
                  className="object-cover object-center filter brightness-[0.75]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/45 to-zinc-950/60 pointer-events-none" />

                <div className="relative z-10 max-w-2xl mx-auto px-4 text-center space-y-3">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-rose-200">
                    {tempHero.tagline || 'BOUTIQUE FEMENINA • VENEZUELA'}
                  </span>
                  <h2 className="font-serif-editorial text-3xl sm:text-5xl font-black text-white tracking-wider leading-none drop-shadow-2xl">
                    {tempHero.title || 'FAKESTORE'}
                  </h2>
                  <p className="font-serif-editorial text-base sm:text-2xl italic text-rose-100 font-normal tracking-wide">
                    {tempHero.subtitle || 'Nueva Colección 2026'}
                  </p>
                  <p className="text-xs text-zinc-200 max-w-lg mx-auto font-normal leading-relaxed line-clamp-2">
                    {tempHero.description || 'Descubre nuestra línea exclusiva de vestidos, jeans, blusas, bodys y ropa deportiva.'}
                  </p>
                  
                  <div className="flex items-center justify-center space-x-3 pt-2">
                    <span className="px-4 py-2 bg-white text-zinc-900 font-extrabold rounded-lg text-xs shadow-md">
                      Ver Catálogo Completo
                    </span>
                    <span className="px-4 py-2 bg-zinc-900/80 text-white font-bold rounded-lg border border-zinc-700 text-xs backdrop-blur-md">
                      Atención WhatsApp
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 right-4 z-10 flex justify-between items-center text-[10px] font-bold text-white border-t border-white/20 pt-2 uppercase tracking-wider">
                  <span>Tasa BCV: 1 USD = {bcvRate.toFixed(2)} Bs.</span>
                  <span>Envíos Nacionales MRW / Tealca</span>
                </div>
              </div>
            </div>

            {/* FORMULARIO DE EDICIÓN */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateHeroConfig(tempHero);
                updateFooterConfig(tempFooter);
                alert('¡Configuración de Textos y Hero guardada con éxito!');
              }}
              className="space-y-6 text-xs pt-4"
            >
              {/* Bloque Hero Banner */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-4">
                <h4 className="text-sm font-bold text-rose-400 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Configuración de los Textos e Imagen</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Subtítulo Superior (Tagline)</label>
                    <input
                      type="text"
                      value={tempHero.tagline}
                      onChange={(e) => setTempHero({ ...tempHero, tagline: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Título Principal (Serif / Vogue)</label>
                    <input
                      type="text"
                      value={tempHero.title}
                      onChange={(e) => setTempHero({ ...tempHero, title: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-extrabold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Subtítulo Cursiva (Colección)</label>
                    <input
                      type="text"
                      value={tempHero.subtitle}
                      onChange={(e) => setTempHero({ ...tempHero, subtitle: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">URL Fotografía de Fondo Editorial</label>
                    <input
                      type="text"
                      value={tempHero.bgImage}
                      onChange={(e) => setTempHero({ ...tempHero, bgImage: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Descripción del Hero</label>
                  <textarea
                    rows="2"
                    value={tempHero.description}
                    onChange={(e) => setTempHero({ ...tempHero, description: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Bloque Footer */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-4">
                <h4 className="text-sm font-bold text-rose-400 flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Configuración del Pie de Página (Footer)</span>
                </h4>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Texto Acerca de la Tienda</label>
                  <textarea
                    rows="2"
                    value={tempFooter.aboutText}
                    onChange={(e) => setTempFooter({ ...tempFooter, aboutText: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Ubicación / Pickup</label>
                    <input
                      type="text"
                      value={tempFooter.address}
                      onChange={(e) => setTempFooter({ ...tempFooter, address: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Horario de Atención</label>
                    <input
                      type="text"
                      value={tempFooter.hours}
                      onChange={(e) => setTempFooter({ ...tempFooter, hours: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-xl shadow-lg shadow-rose-500/20 flex items-center space-x-2 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios de Textos</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PESTAÑA 4: GESTIÓN DE CATEGORÍAS */}
        {activeTab === 'categories' && (
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Gestor Dinámico de Categorías</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Agrega, edita o elimina las categorías de la boutique. Se actualizarán automáticamente en los filtros y menús de la tienda.
              </p>
            </div>

            {/* Formulario Agregar Categoría */}
            <form onSubmit={handleAddCategory} className="flex gap-3 max-w-md">
              <input
                type="text"
                placeholder="Nombre de nueva categoría (ej. Bodys)..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </form>

            {/* Lista de Categorías */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between"
                >
                  {editingCat === cat.id ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        defaultValue={cat.name}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveCategoryEdit(cat.id, e.target.value);
                          }
                        }}
                        className="bg-zinc-900 border border-rose-400 rounded-lg px-2 py-1 text-xs text-white w-full"
                        autoFocus
                      />
                      <button
                        onClick={(e) => {
                          const inputEl = e.currentTarget.previousElementSibling;
                          handleSaveCategoryEdit(cat.id, inputEl.value);
                        }}
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold text-white">{cat.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">({cat.id})</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingCat(cat.id)}
                          className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
                          title="Editar Nombre"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg"
                          title="Eliminar Categoría"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de Crear / Editar Producto */}
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productToEdit={editingProduct}
        />

      </div>
    </div>
  );
}
