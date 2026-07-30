'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, CreditCard, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Footer() {
  const { footerConfig, ownerPhone, categories } = useStore();

  return (
    <footer className="bg-zinc-900 text-zinc-400 text-sm border-t border-zinc-800">
      {/* Grid de Beneficios */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center space-x-4 p-4 rounded-xl bg-zinc-850/60 border border-zinc-800">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-100">Envíos a Nivel Nacional</h4>
            <p className="text-xs text-zinc-400">MRW, Tealca, Zoom y Entregas Personales.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 rounded-xl bg-zinc-850/60 border border-zinc-800">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-100">Pagos Adaptados en VE</h4>
            <p className="text-xs text-zinc-400">Pago Móvil (Bs), Zelle, Binance Pay y Cash.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 rounded-xl bg-zinc-850/60 border border-zinc-800">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-100">Atención por WhatsApp</h4>
            <p className="text-xs text-zinc-400">Trato directo y personalizado.</p>
          </div>
        </div>
      </div>

      {/* Secciones Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white font-bold shadow-md shadow-rose-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold text-zinc-100">FAKESTORE<span className="text-rose-400">.VE</span></span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {footerConfig.aboutText}
          </p>
        </div>

        <div>
          <h4 className="text-zinc-100 font-bold mb-4">Navegación</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-rose-400 transition-colors">Inicio</Link></li>
            <li><Link href="/tienda" className="hover:text-rose-400 transition-colors">Catálogo de Moda</Link></li>
            <li><Link href="/contacto" className="hover:text-rose-400 transition-colors">Atención al Cliente</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-zinc-100 font-bold mb-4">Colecciones</h4>
          <ul className="space-y-2 text-xs">
            {categories.slice(0, 4).map((cat) => (
              <li key={cat.id}>
                <Link href={`/tienda?cat=${cat.id}`} className="hover:text-rose-400 transition-colors capitalize">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-zinc-100 font-bold mb-4">Contacto Directo</h4>
          <p className="text-xs text-zinc-400 mb-2">{footerConfig.address}</p>
          <p className="text-xs text-rose-400 font-semibold mb-2">WhatsApp: {ownerPhone}</p>
          <p className="text-xs text-zinc-400">{footerConfig.hours}</p>
        </div>
      </div>

      <div className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500">
        <p>
          &copy; {new Date().getFullYear()} FakeStore.VE. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
