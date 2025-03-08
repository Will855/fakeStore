import React, { useEffect, useState } from 'react';
import { AutohideSnackbar } from '../materialUI/Snackbar';

const Allproducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error en la red');
                }
                return res.json();
            })
            .then(json => {
                setProducts(json);
            })
            .catch(error => {
                console.error('Hubo un problema con la petición Fetch:', error);
            });
    }, []);

    return (
        <div className="product-list">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    );
};
export default Allproducts;

export const ProductCard = ({ product, onBuy }) => {
    return (
        <div className="product-card flex flex-col items-stretch w-64 h-96 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            {/* Contenedor de imagen con tamaño fijo y relación de aspecto */}
            <div className="image-container w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                    className="w-full h-full object-contain p-2"
                    src={product.image}
                    alt={product.title}
                    onError={(e) => {
                        e.target.src = '/placeholder-image.png'; // Fallback para imágenes rotas
                        e.target.className = 'w-full h-full object-cover'; // Cambiar estilo si hay fallback
                    }}
                />
            </div>

            {/* Contenido de texto con tamaño fijo */}
            <div className="text-content flex flex-col flex-grow justify-between">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                    {product.title}
                </h2>

                <div className="buyBx flex items-center justify-between">
                    <p className="text-xl font-bold text-indigo-600">
                        ${Number(product.price).toFixed(2)}
                    </p>
                    <AutohideSnackbar
                        productId={product.id}
                        product={product}
                        onClick={onBuy}
                        className="ml-2"
                    />
                </div>
            </div>
        </div>
    );
};


/*

   * Qué hace Allprducts:
Es el componente principal que maneja la lista de productos

Hace una petición a la API de Fake Store para obtener todos los productos

Muestra los productos usando componentes ProductCard

    *Cómo funciona:

useState: Crea un estado para almacenar la lista de productos

useEffect: Se ejecuta al montar el componente (array de dependencias vacío)

Hace una petición GET a la API

Si la respuesta es exitosa (res.ok), convierte la respuesta a JSON

Actualiza el estado con los productos obtenidos

Maneja errores de red o petición

Renderiza un contenedor con todos los ProductCards
*/

/*
    
*   Qué hace ProductCard:

Muestra la tarjeta individual de cada producto

Muestra imagen, título y precio del producto

Incluye un componente AutohideSnackbar (probablemente para notificaciones o acciones de compra)

*   Cómo funciona:

Recibe como props el objeto product y una función onBuy

Muestra la imagen del producto con clases de estilo (Tailwind CSS)

Muestra el título y precio del producto

El componente AutohideSnackbar probablemente maneja alguna interacción de usuario (como agregar al carrito)
-----------------------------------------------

*   Flujo general:

Al montarse Allproducts, hace fetch a la API

Cuando recibe los datos, actualiza el estado products

Se rerenderiza la lista de ProductCards con los datos obtenidos

Cada ProductCard muestra la información de un producto individual

Características importantes:

Manejo de errores en la petición fetch

Uso de keys únicas para la lista de productos

Componentización (separación de responsabilidades)

Uso de Hooks de React (useState, useEffect)

Integración con Material UI a través de AutohideSnackbar

Estilos con clases de Tailwind CSS (w-2/3, h-5/3) y clases personalizadas

-----------------------------------------

!   Posibles mejoras:

Agregar un estado de carga

Manejar errores en la UI (no solo console.error)

Implementar paginación

Agregar PropTypes/TypeScript para validación de props

Manejar el evento onBuy del Snackbar

Optimizar imágenes (lazy loading, tamaño adecuado)
*/