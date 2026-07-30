'use client';

import React from 'react';
import { Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function ContactoPage() {
  const { ownerPhone } = useStore();

  return (
    <div className="py-16 bg-gradient-to-b from-rose-50/20 via-white to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Atención Personalizada</span>
          <h1 className="text-4xl font-black text-slate-800">Canales de Contacto Directo</h1>
          <p className="text-sm text-slate-600">
            Estamos disponibles para responder tus preguntas sobre compras en Bolívares, garantías, despachos o retiros personales.
          </p>
        </div>

        {/* Tarjetas de Información */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm space-y-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">WhatsApp Oficial</h3>
            <p className="text-xs text-slate-500">Atención directa con el dueño de la tienda</p>
            <p className="text-base font-extrabold text-rose-600">{ownerPhone}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm space-y-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Ubicación Pickup</h3>
            <p className="text-xs text-slate-500">Caracas, Venezuela</p>
            <p className="text-sm font-semibold text-slate-700">El Chacao / Las Mercedes</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm space-y-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Horario de Respuestas</h3>
            <p className="text-xs text-slate-500">Lunes a Sábado</p>
            <p className="text-sm font-semibold text-slate-700">8:00 AM – 7:00 PM</p>
          </div>
        </div>

        {/* Sección de Formulario de Mensaje */}
        <div className="bg-white p-8 rounded-2xl border border-rose-100 shadow-lg shadow-rose-500/5 max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 text-center">Escríbenos una Consulta</h2>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.name.value;
              const msg = e.target.msg.value;
              const text = encodeURIComponent(`Hola, mi nombre es ${name}.\n\nConsulta:\n${msg}`);
              window.open(`https://wa.me/${ownerPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="ej. María Rodríguez"
                className="w-full bg-rose-50/30 border border-rose-100 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-rose-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detalle de tu Consulta *</label>
              <textarea
                name="msg"
                required
                rows="4"
                placeholder="Escribe aquí tu duda sobre productos, métodos de pago o envíos..."
                className="w-full bg-rose-50/30 border border-rose-100 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-rose-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold rounded-xl shadow-md shadow-rose-500/20 flex items-center justify-center space-x-2 transition-all text-base"
            >
              <Send className="w-5 h-5" />
              <span>Enviar Mensaje a WhatsApp</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
