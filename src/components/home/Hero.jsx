'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Hero() {
  const { bcvRate, heroConfig } = useStore();

  return (
    <section className="relative w-full h-[650px] md:h-[720px] overflow-hidden flex items-center justify-center bg-zinc-950">
      
      {/* Fotografía Editorial de Fondo */}
      <Image
        src={heroConfig.bgImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85"}
        alt="Boutique Editorial Moda Femenina"
        fill
        className="object-cover object-center filter brightness-[0.75]"
        priority
      />

      {/* Overlay de Sombra Creadora de Contraste Editorial */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/45 to-zinc-950/60 pointer-events-none" />

      {/* Contenido Editorial Superpuesto */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        {/* Título Principal Tipografía Serif Editorial en Alto Contraste */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-rose-200/90">
            {heroConfig.tagline || 'Boutique Femenina • Venezuela'}
          </span>
          
          <h1 className="font-serif-editorial text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-wider leading-none drop-shadow-2xl">
            {heroConfig.title || 'FAKESTORE'}
          </h1>
          
          <p className="font-serif-editorial text-2xl sm:text-4xl italic text-rose-100 font-normal tracking-wide drop-shadow-md">
            {heroConfig.subtitle || 'Nueva Colección 2026'}
          </p>
        </div>

        {/* Subtítulo Sobrio en Blanco */}
        <p className="text-sm sm:text-base text-zinc-200 max-w-2xl mx-auto font-normal leading-relaxed tracking-wide drop-shadow-sm">
          {heroConfig.description || 'Descubre nuestra línea exclusiva de vestidos, jeans, blusas, bodys y ropa deportiva. Precios en USD con conversión oficial al BCV.'}
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
          <Link
            href="/tienda"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-rose-50 text-zinc-900 font-extrabold rounded-xl shadow-xl flex items-center justify-center space-x-2.5 transition-all text-sm transform hover:-translate-y-0.5 tracking-wide"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-4 h-4 text-zinc-900" />
          </Link>

          <Link
            href="/contacto"
            className="w-full sm:w-auto px-7 py-4 bg-zinc-900/80 hover:bg-zinc-900 text-white font-bold rounded-xl border border-zinc-700/80 backdrop-blur-md flex items-center justify-center transition-colors text-sm tracking-wide"
          >
            <span>Atención WhatsApp</span>
          </Link>
        </div>

      </div>

      {/* Cintas Inferiores con Tasa BCV y Logística */}
      <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col sm:flex-row justify-between items-center text-xs uppercase font-bold tracking-widest text-white border-t border-white/20 pt-5 gap-3 sm:gap-0">
        <div className="flex items-center space-x-2">
          <span className="text-zinc-300 font-semibold">Tasa BCV del Día:</span>
          <span className="text-white font-black">1 USD = {bcvRate.toFixed(2)} Bs.</span>
        </div>
        <span className="hidden md:inline text-zinc-300 font-medium">Envíos Nacionales MRW / Tealca / Zoom</span>
        <span className="text-zinc-300 font-medium">Pago Móvil / Zelle / Binance</span>
      </div>

    </section>
  );
}
