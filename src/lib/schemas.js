import { z } from 'zod';

// Regex para números de teléfono venezolanos (0412, 0414, 0424, 0416, 0426 o con formato internacional +58)
const venezuelanPhoneRegex = /^(\+?58|0)?(412|414|424|416|426|2\d{2})[0-9]{7}$/;

// 1. Esquema de Validación para Checkout y Logística de Pago
export const checkoutSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .max(80, 'El nombre no puede exceder 80 caracteres.')
    .trim(),
  phone: z.string()
    .min(10, 'El número de teléfono debe tener al menos 10 dígitos.')
    .max(15, 'Número de teléfono inválido.')
    .regex(venezuelanPhoneRegex, 'Ingresa un número de teléfono válido (ej. 0414-1234567 o 04121234567).'),
  deliveryMethod: z.string()
    .min(1, 'Selecciona una opción de entrega.'),
  address: z.string()
    .min(3, 'Ingresa una dirección o agencia de envío válida.')
    .max(200, 'La dirección no puede exceder 200 caracteres.')
    .trim(),
  paymentMethod: z.string()
    .min(1, 'Selecciona un método de pago.'),
});

// 2. Esquema de Validación para Creación/Edición de Productos
export const productSchema = z.object({
  title: z.string()
    .min(3, 'El título de la prenda debe tener al menos 3 caracteres.')
    .max(100, 'El título no puede exceder 100 caracteres.')
    .trim(),
  sku: z.string()
    .min(3, 'El código SKU debe tener al menos 3 caracteres.')
    .max(30, 'El SKU no puede exceder 30 caracteres.')
    .regex(/^[A-Za-z0-9_-]+$/, 'El SKU solo debe contener letras, números, guiones y subguiones.')
    .trim(),
  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres.')
    .optional()
    .default(''),
  priceUSD: z.number({ invalid_type_error: 'El precio debe ser un número válido.' })
    .positive('El precio debe ser mayor a 0 USD.')
    .max(10000, 'El precio excede el límite máximo.'),
  category: z.string()
    .min(1, 'Selecciona una categoría para el producto.'),
  image: z.string()
    .url('Ingresa una URL de imagen válida.')
    .or(z.string().min(1, 'Ingresa la ruta o URL de la imagen.')),
  sizeStock: z.object({
    S: z.number().min(0, 'El stock no puede ser negativo.'),
    M: z.number().min(0, 'El stock no puede ser negativo.'),
    L: z.number().min(0, 'El stock no puede ser negativo.'),
    XL: z.number().min(0, 'El stock no puede ser negativo.'),
  }),
  measurements: z.string()
    .max(300, 'Las medidas no pueden exceder 300 caracteres.')
    .optional()
    .default(''),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isOffer: z.boolean().default(false),
  discountPercentage: z.number()
    .min(0, 'El descuento mínimo es 0%.')
    .max(99, 'El descuento no puede ser 100% o superior.')
    .default(0),
});

// 3. Esquema de Validación para Formulario de Contacto
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(80, 'El nombre no puede exceder 80 caracteres.')
    .trim(),
  email: z.string()
    .email('Ingresa un correo electrónico válido.')
    .trim(),
  phone: z.string()
    .min(7, 'El teléfono debe tener al menos 7 dígitos.')
    .max(20, 'Número de teléfono inválido.'),
  subject: z.string()
    .min(2, 'Ingresa un asunto válido.')
    .max(100, 'El asunto no puede exceder 100 caracteres.')
    .trim(),
  message: z.string()
    .min(5, 'El mensaje debe contener al menos 5 caracteres.')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres.')
    .trim(),
});

// 4. Esquema de Validación para Categorías
export const categorySchema = z.object({
  name: z.string()
    .min(2, 'El nombre de la categoría debe tener al menos 2 caracteres.')
    .max(40, 'El nombre no puede exceder 40 caracteres.')
    .trim(),
});

// 5. Esquema de Validación para Configuración del Hero Banner
export const heroConfigSchema = z.object({
  tagline: z.string().min(2).max(80).trim(),
  title: z.string().min(2).max(80).trim(),
  subtitle: z.string().min(2).max(80).trim(),
  description: z.string().min(5).max(300).trim(),
  bgImage: z.string().min(1, 'Ingresa una URL válida de imagen de fondo.'),
});
