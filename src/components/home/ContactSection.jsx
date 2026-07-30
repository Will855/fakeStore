'use client';

import React from 'react';
import { MessageSquare, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function ContactSection() {
  const { ownerPhone } = useStore();

  return (
    <section className="py-16 bg-white border-b border-rose-100/60" id="contacto-home">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Info Contacto */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Atención Inmediata</span>
            </div>
            
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Contáctate con Nosotros
            </h2>
            
            <p className="text-sm text-slate-600 leading-relaxed">
              ¿Tienes dudas sobre tallas, envíos nacionales o métodos de pago en Bolívares? Escríbenos directamente a nuestro WhatsApp oficial y un asesor te atenderá en minutos.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-rose-50/50 border border-rose-100">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-slate-500 font-medium">Atención WhatsApp</h4>
                  <p className="text-sm font-bold text-slate-800">{ownerPhone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-rose-50/50 border border-rose-100">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-slate-500 font-medium">Ubicación Pickup</h4>
                  <p className="text-sm font-bold text-slate-800">Caracas, Venezuela (Pickup disponible)</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-rose-50/50 border border-rose-100">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-slate-500 font-medium">Horario de Atención</h4>
                  <p className="text-sm font-bold text-slate-800">Lunes a Sábado: 8:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario Rápido de Consulta */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-rose-100 shadow-lg shadow-rose-500/5 space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Envíanos un mensaje rápido</h3>
            <p className="text-xs text-slate-500">Te redirigiremos a WhatsApp con tu pregunta formulada.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const text = encodeURIComponent(`Hola, quisiera consultar lo siguiente:\n\n${e.target.message.value}`);
                window.open(`https://wa.me/${ownerPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
              }}
              className="space-y-4 pt-2"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tu Consulta *</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  placeholder="ej. Quisiera saber la disponibilidad de vestidos en talla M..."
                  className="w-full bg-rose-50/30 border border-rose-100 rounded-xl p-3.5 text-sm text-slate-800 focus:border-rose-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all text-sm shadow-md shadow-rose-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Consulta a WhatsApp</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
