'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Send, Truck, ShieldCheck, ChevronDown, ZoomIn, X, RotateCcw, Ruler } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatUSD, formatVES } from '@/lib/utils';

export default function ProductoPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const productId = params.id;

  const { products, addToCart, bcvRate, ownerPhone } = useStore();
  
  const product = products.find(p => p.id === productId) || products.find(p => p.id === 'prod-1');

  const [selectedImage, setSelectedImage] = useState(product ? product.image : '');
  
  // Tallas disponibles con su stock correspondiente
  const sizeStock = product?.sizeStock || { S: 2, M: 4, L: 2, XL: 0 };
  const allSizes = ['S', 'M', 'L', 'XL'];

  // Buscar primera talla con stock > 0 para pre-seleccionar
  const firstAvailableSize = allSizes.find(sz => (sizeStock[sz] || 0) > 0) || 'M';
  const [selectedSize, setSelectedSize] = useState(firstAvailableSize);

  useEffect(() => {
    if (product && product.sizeStock) {
      const avail = allSizes.find(sz => (product.sizeStock[sz] || 0) > 0);
      if (avail) setSelectedSize(avail);
    }
  }, [product]);

  const [activeAccordion, setActiveAccordion] = useState('details');

  // Estado para Modal de Zoom (First-Mobile Lightbox)
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  if (!product) {
    return (
      <div className="py-20 text-center max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Producto no encontrado</h1>
        <Link href="/tienda" className="text-sm font-bold text-rose-600 underline">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const galleryImages = [
    product.image,
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop&q=80'
  ];

  const currentImageToShow = selectedImage || product.image;

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .concat(products.filter(p => p.id !== product.id))
    .slice(0, 3);

  const effectivePrice = product.isOffer && product.discountPercentage > 0
    ? product.priceUSD * (1 - product.discountPercentage / 100)
    : product.priceUSD;

  const priceVES = effectivePrice * bcvRate;

  // Comprobar stock de la talla seleccionada
  const currentSizeAvailableStock = sizeStock[selectedSize] || 0;

  return (
    <div className="bg-white min-h-screen py-6 sm:py-8 border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-4 sm:mb-6 flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-rose-600 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/tienda" className="hover:text-rose-600 transition-colors">Tienda</Link>
          <span>/</span>
          <Link href={`/tienda?cat=${product.category}`} className="capitalize hover:text-rose-600 transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-slate-800 truncate max-w-[150px] sm:max-w-[200px]">{product.title}</span>
        </div>

        {/* Botón Volver */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/tienda"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors bg-rose-50/50 border border-rose-100 px-3.5 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo</span>
          </Link>
        </div>

        {/* Grilla Principal del Producto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16 sm:mb-20">
          
          {/* Columna Izquierda: Galería de Fotografías */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Foto Principal con botón de Zoom Touch First-Mobile */}
            <div
              onClick={() => setIsZoomOpen(true)}
              className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-rose-50/40 border border-rose-100 shadow-sm cursor-zoom-in group"
            >
              <Image
                src={currentImageToShow}
                alt={product.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                priority
              />
              
              {product.isOffer && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md z-10">
                  -{product.discountPercentage}% OFF
                </span>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomOpen(true);
                }}
                className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white p-3 rounded-full backdrop-blur-md shadow-lg transition-transform transform active:scale-95 flex items-center space-x-1.5 text-xs font-bold z-10"
              >
                <ZoomIn className="w-4 h-4" />
                <span className="hidden sm:inline">Ampliar Foto</span>
              </button>
            </div>

            {/* Miniaturas de la Galería */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden bg-rose-50 border transition-all ${
                    currentImageToShow === img
                      ? 'border-rose-500 ring-2 ring-rose-500/20 scale-[0.98]'
                      : 'border-rose-100 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Vista ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Información y Compra */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Encabezado del Producto */}
            <div className="space-y-2 border-b border-rose-100/80 pb-6">
              <div className="flex justify-between items-center text-xs font-bold text-rose-500 uppercase tracking-widest">
                <span>SKU: {product.sku}</span>
                <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded border border-rose-200">{product.category}</span>
              </div>

              <h1 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Precio en USD y Bolívares */}
              <div className="pt-2">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black text-slate-900">{formatUSD(effectivePrice)}</span>
                  {product.isOffer && (
                    <span className="text-base text-slate-400 line-through font-semibold">
                      {formatUSD(product.priceUSD)}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-rose-600 mt-1">
                  Monto a pagar en Bolívares: <strong className="text-slate-900 font-extrabold">{formatVES(priceVES)}</strong>
                  <span className="text-[11px] text-slate-400 block font-normal">(Tasa Oficial BCV: {bcvRate.toFixed(2)} Bs./$)</span>
                </p>
              </div>
            </div>

            {/* Selector de Tallas Guiado por el Stock Real en la BD */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                <span>Seleccionar Talla</span>
                <span className="text-slate-500 text-[11px] font-normal">
                  Disponibles en Talla {selectedSize}: <strong className="text-slate-900 font-bold">{currentSizeAvailableStock} unid.</strong>
                </span>
              </div>

              {/* Botones de Talla (Tallas sin stock desactivadas/tachadas) */}
              <div className="grid grid-cols-4 gap-2">
                {allSizes.map((size) => {
                  const stockForSize = sizeStock[size] || 0;
                  const isAvailable = stockForSize > 0;
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`py-3 rounded-xl text-xs font-extrabold border transition-all relative ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                          : isAvailable
                          ? 'bg-white text-slate-700 border-rose-100 hover:border-rose-300'
                          : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50 cursor-not-allowed line-through'
                      }`}
                    >
                      <span>{size}</span>
                      {!isAvailable && (
                        <span className="block text-[9px] font-bold no-underline text-rose-500 leading-none">Agotada</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bloque Explicativo de Medidas de la Prenda (Cargado desde el Admin) */}
              {product.measurements && (
                <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-100/80 space-y-1 text-xs">
                  <div className="flex items-center space-x-1.5 text-rose-600 font-bold text-[11px] uppercase tracking-wider">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Medidas de la Prenda (cm)</span>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {product.measurements}
                  </p>
                </div>
              )}

            </div>

            {/* Estado de Stock Total */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Stock Total en Tienda: <strong className="text-slate-800">{product.stock} unidades distribuidas en tallas</strong></span>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => addToCart(product, selectedSize)}
                disabled={currentSizeAvailableStock <= 0}
                className={`w-full py-4 rounded-xl shadow-lg flex items-center justify-center space-x-2.5 transition-all text-sm uppercase tracking-wider font-extrabold ${
                  currentSizeAvailableStock <= 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.99]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{currentSizeAvailableStock <= 0 ? `Talla ${selectedSize} Agotada` : `Agregar Talla ${selectedSize} al Carrito`}</span>
              </button>

              <button
                onClick={() => {
                  const msg = encodeURIComponent(`Hola, me interesa comprar la prenda: ${product.title} (SKU: ${product.sku}) en Talla ${selectedSize}. Precios: ${formatUSD(effectivePrice)} / ${formatVES(priceVES)}.`);
                  window.open(`https://wa.me/${ownerPhone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
                }}
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md shadow-rose-500/20 flex items-center justify-center space-x-2 transition-all text-sm active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>Comprar Directo por WhatsApp</span>
              </button>
            </div>

            {/* Acordeones Informativos */}
            <div className="border-t border-rose-100 pt-4 space-y-3">
              
              <div className="border border-rose-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'details' ? null : 'details')}
                  className="w-full p-4 text-left font-bold text-xs text-slate-800 uppercase tracking-wider flex justify-between items-center bg-rose-50/30"
                >
                  <span>Descripción y Detalles</span>
                  <ChevronDown className={`w-4 h-4 text-rose-500 transition-transform ${activeAccordion === 'details' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'details' && (
                  <div className="p-4 text-xs text-slate-600 leading-relaxed space-y-2 border-t border-rose-100/60 bg-white">
                    <p>{product.description}</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-500 pt-1">
                      <li>Confección de alta calidad y acabado sastre.</li>
                      <li>Horma adaptada a medidas femeninas estándar.</li>
                      <li>Instrucciones de lavado: Lavar a mano o ciclo delicado.</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="border border-rose-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full p-4 text-left font-bold text-xs text-slate-800 uppercase tracking-wider flex justify-between items-center bg-rose-50/30"
                >
                  <span>Envíos y Retiros en Venezuela</span>
                  <ChevronDown className={`w-4 h-4 text-rose-500 transition-transform ${activeAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="p-4 text-xs text-slate-600 leading-relaxed space-y-2 border-t border-rose-100/60 bg-white">
                    <div className="flex items-start space-x-2">
                      <Truck className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                      <p>Envíos cobro en destino a nivel nacional a través de MRW, Tealca y Zoom.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <ShieldCheck className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                      <p>Entregas personales y Pickup disponible en Caracas.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Sección Inferior: COMBÍNALO CON / STYLED WITH */}
        <div className="border-t border-rose-100 pt-12 sm:pt-16">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-rose-500">Editorial Fashion</span>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-black text-slate-900 mt-1 uppercase tracking-wider">
              STYLED WITH / COMBÍNALO CON
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/producto/${rel.id}`}
                className="group bg-white p-4 rounded-2xl border border-rose-100 hover:border-rose-300 transition-all hover:shadow-lg hover:shadow-rose-500/5 text-center"
              >
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-rose-50">
                  <Image src={rel.image} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-rose-600 transition-colors">{rel.title}</h4>
                <p className="text-xs font-black text-slate-900 mt-1">{formatUSD(rel.priceUSD)}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Modal de Zoom a Pantalla Completa (First-Mobile Lightbox) */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
          
          <div className="flex justify-between items-center text-white z-10 pt-2">
            <div>
              <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">{product.title}</p>
              <p className="text-[10px] text-zinc-400">Toca para acercar o alejar la prenda</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomScale(zoomScale === 1 ? 1.8 : 1)}
                className="p-2.5 bg-zinc-800/80 hover:bg-zinc-800 rounded-full text-white text-xs font-bold flex items-center space-x-1"
                title="Restablecer o Ampliar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsZoomOpen(false);
                  setZoomScale(1);
                }}
                className="p-2.5 bg-rose-500 hover:bg-rose-600 rounded-full text-white"
                title="Cerrar Zoom"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            onClick={() => setZoomScale(zoomScale === 1 ? 1.8 : 1)}
            className="relative flex-1 w-full my-4 flex items-center justify-center cursor-zoom-out overflow-auto"
          >
            <div
              className="relative w-full h-full max-w-4xl max-h-[80vh] transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomScale})` }}
            >
              <Image
                src={currentImageToShow}
                alt={product.title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="flex justify-center items-center space-x-3 z-10 pb-2">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-12 h-14 relative rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageToShow === img ? 'border-rose-500 scale-105' : 'border-zinc-700 opacity-60'
                }`}
              >
                <Image src={img} alt={`Vista miniatura ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
