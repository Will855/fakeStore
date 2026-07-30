'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: '¿Cómo funcionan los pagos en Bolívares?',
      a: 'Calculamos el monto exacto en Bolívares en tiempo real basándonos en la Tasa Oficial vigente del Banco Central de Venezuela (BCV). Aceptamos Pago Móvil y Transferencias Bancarias inmediatas.',
    },
    {
      q: '¿Hacen envíos a todo el país?',
      a: 'Sí, realizamos envíos nacionales cobro en destino a través de MRW, Tealca y Zoom. Todos los paquetes viajan debidamente embalados y asegurados.',
    },
    {
      q: '¿Cómo se concreta la compra si no hay pasarela de pago directa?',
      a: 'Al hacer clic en "Confirmar Pedido por WhatsApp", nuestro sistema genera un desglose completo de tu compra en USD y Bs. Se abre tu WhatsApp con los datos de tu orden y el administrador te enviará los datos bancarios para verificar tu pago de inmediato.',
    },
    {
      q: '¿Qué hago si necesito cambio de talla?',
      a: 'Dispones de 48 horas posteriores a la recepción de tu paquete para solicitar cambio de talla, siempre y cuando la prenda conserve sus etiquetas y se encuentre en perfecto estado.',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-rose-100/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Resolvemos tus Dudas</span>
          </div>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Preguntas Frecuentes (FAQ)
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center space-x-4 hover:bg-rose-50/50 transition-colors"
                >
                  <span className="font-bold text-slate-800 text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-rose-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 border-t border-rose-100/60 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
