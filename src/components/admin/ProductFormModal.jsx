'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, ChevronDown, AlertCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { productSchema } from '@/lib/schemas';

export default function ProductFormModal({ isOpen, onClose, productToEdit }) {
  const { addProduct, updateProduct, categories } = useStore();

  const defaultCatId = categories && categories.length > 0 ? categories[0].id : 'vestidos';

  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    description: '',
    priceUSD: '',
    category: defaultCatId,
    image: '',
    sizeStock: { S: 2, M: 4, L: 2, XL: 0 },
    measurements: '',
    isNew: false,
    isFeatured: false,
    isOffer: false,
    discountPercentage: 0,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const validDefaultCategory = categories && categories.length > 0 ? categories[0].id : 'vestidos';
    setFormErrors({});

    if (productToEdit) {
      const categoryExists = categories.some(c => c.id === productToEdit.category);
      setFormData({
        ...productToEdit,
        category: categoryExists ? productToEdit.category : validDefaultCategory,
        sizeStock: productToEdit.sizeStock || { S: 0, M: productToEdit.stock || 0, L: 0, XL: 0 },
        measurements: productToEdit.measurements || '',
      });
    } else {
      setFormData({
        title: '',
        sku: `ED-PROD-${Math.floor(100 + Math.random() * 900)}`,
        description: '',
        priceUSD: '',
        category: validDefaultCategory,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
        sizeStock: { S: 2, M: 4, L: 2, XL: 0 },
        measurements: 'Talla S: Busto 85cm / Cintura 66cm | Talla M: Busto 90cm / Cintura 71cm | Talla L: Busto 95cm / Cintura 76cm',
        isNew: true,
        isFeatured: false,
        isOffer: false,
        discountPercentage: 0,
      });
    }
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSizeStockChange = (size, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setFormData(prev => ({
      ...prev,
      sizeStock: {
        ...prev.sizeStock,
        [size]: num,
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors({});

    const rawPayload = {
      ...formData,
      priceUSD: parseFloat(formData.priceUSD),
      discountPercentage: parseInt(formData.discountPercentage, 10) || 0,
    };

    // Validar con esquema Zod
    const validationResult = productSchema.safeParse(rawPayload);

    if (!validationResult.success) {
      const formattedErrors = {};
      validationResult.error.issues.forEach(issue => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0]] = issue.message;
        }
      });
      setFormErrors(formattedErrors);
      return;
    }

    const validData = validationResult.data;
    const totalCalculatedStock = Object.values(validData.sizeStock || {}).reduce((a, b) => a + b, 0);

    const payload = {
      ...validData,
      stock: totalCalculatedStock,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 md:p-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden text-zinc-100 my-6">
        
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
          <h3 className="text-sm sm:text-base font-bold text-white">
            {productToEdit ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Título del Producto *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full bg-zinc-950 border rounded-xl px-3.5 py-2.5 text-white focus:outline-none ${
                  formErrors.title ? 'border-rose-500 bg-rose-950/20' : 'border-zinc-700 focus:border-rose-400'
                }`}
              />
              {formErrors.title && (
                <p className="text-[11px] text-rose-400 font-semibold mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.title}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Código SKU *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className={`w-full bg-zinc-950 border rounded-xl px-3.5 py-2.5 text-white focus:outline-none ${
                  formErrors.sku ? 'border-rose-500 bg-rose-950/20' : 'border-zinc-700 focus:border-rose-400'
                }`}
              />
              {formErrors.sku && (
                <p className="text-[11px] text-rose-400 font-semibold mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.sku}</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-bold mb-1">Descripción</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:border-rose-400 focus:outline-none"
            />
          </div>

          {/* Medidas de la Prenda */}
          <div>
            <label className="block text-zinc-300 font-bold mb-1">Medidas de la Prenda (cm)</label>
            <textarea
              rows="2"
              placeholder="ej. Talla S: Busto 85cm / Cintura 66cm | Talla M: Busto 90cm / Cintura 71cm"
              value={formData.measurements}
              onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:border-rose-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Precio (USD $) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.priceUSD}
                onChange={(e) => setFormData({ ...formData, priceUSD: e.target.value })}
                className={`w-full bg-zinc-950 border rounded-xl px-3.5 py-2.5 text-white focus:outline-none ${
                  formErrors.priceUSD ? 'border-rose-500 bg-rose-950/20' : 'border-zinc-700 focus:border-rose-400'
                }`}
              />
              {formErrors.priceUSD && (
                <p className="text-[11px] text-rose-400 font-semibold mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.priceUSD}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Categoría</label>
              <div className="relative flex items-center">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full appearance-none bg-zinc-950 border border-zinc-700 rounded-xl pl-3.5 pr-10 py-2.5 text-white focus:border-rose-400 focus:outline-none font-bold cursor-pointer capitalize"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-zinc-900">
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Inventario de Stock por Talla */}
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
            <span className="font-bold text-zinc-200 block text-xs">Inventario de Unidades por Talla:</span>
            <p className="text-[11px] text-zinc-400">Las tallas en 0 se mostrarán inactivas/deshabilitadas en la tienda.</p>
            
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {['S', 'M', 'L', 'XL'].map((sz) => (
                <div key={sz} className="space-y-1">
                  <label className="block text-center font-bold text-rose-400">Talla {sz}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sizeStock?.[sz] ?? 0}
                    onChange={(e) => handleSizeStockChange(sz, e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-center text-white font-bold"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-bold mb-1">URL de Foto de la Prenda *</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className={`w-full bg-zinc-950 border rounded-xl px-3.5 py-2.5 text-white focus:outline-none ${
                formErrors.image ? 'border-rose-500 bg-rose-950/20' : 'border-zinc-700 focus:border-rose-400'
              }`}
            />
            {formErrors.image && (
              <p className="text-[11px] text-rose-400 font-semibold mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{formErrors.image}</span>
              </p>
            )}
          </div>

          {/* Opciones Especiales de Descuentos y Etiquetas */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
            <span className="font-bold text-zinc-300 block">Etiquetas y Descuentos:</span>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-900 text-rose-500 focus:ring-0"
                />
                <span>Nuevo Lanzamiento</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0"
                />
                <span>Destacado (Top)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOffer}
                  onChange={(e) => setFormData({ ...formData, isOffer: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-900 text-rose-500 focus:ring-0"
                />
                <span>En Oferta / Descuento</span>
              </label>
            </div>

            {formData.isOffer && (
              <div className="pt-2">
                <label className="block text-zinc-400 mb-1">% de Descuento a Aplicar (ej. 15 = -15% OFF)</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                  className="w-full sm:w-40 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold text-sm"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 text-zinc-300 font-bold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl flex items-center space-x-2 shadow-md shadow-rose-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{productToEdit ? 'Guardar Cambios' : 'Crear Producto'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
