# FakeStore - Arquitectura e Ingenieria

Plataforma de comercio electronico y administracion de inventario construida sobre Next.js (App Router), con logica de negocio ejecutada en Server Actions, validacion estricta de esquemas en tiempo de ejecucion (Zod), persistencia hibrida (Supabase PostgreSQL + fallback local) y un pipeline resiliente de sincronizacion cambiaria multimoneda (USD / VES).

---

## 1. Arquitectura del Sistema

La aplicacion implementa el paradigma App Router de Next.js, combinando Server Actions para la ejecucion de logica transaccional segura con Client Components para la reactividad de la interfaz de usuario:

- Capa Transaccional en Servidor: Ejecucion de Server Actions (`createVerifiedOrderServer`) para prevenir alteraciones de carga util (payload tampering) y garantizar calculos de precios autoritativos.
- Persistencia Hibrida con Tolerancia a Fallos: Integracion con Supabase Database a traves de una capa de servicio desacoplada (`productService.js`, `orderService.js`) con conmutacion automatica (fallback) a instantaneas JSON locales ante fallos de conectividad o ausencia de credenciales.
- Automatizacion Perimetral (Edge Cron): Endpoint programado (`/api/cron/bcv`) protegido mediante autenticacion Bearer (`CRON_SECRET`) para revalidar y sincronizar tipos de cambio en segundo plano.

```text
[Cliente Web (React Context)]
       |
       |-- (Mutaciones / Checkout)
       v
[Next.js Server Actions: 'use server']
       |
       |-- 1. Recalculo autoritativo de precios e inventario
       |-- 2. Validacion de esquemas Zod (Datos de envio / SKU)
       |-- 3. Inyeccion de Tasa Cambiaria Verificada
       |
       +---> [Supabase PostgreSQL Layer]
       |     (Fallback de contingencia a JSON Snapshot)
       |
       v
[Respuesta Transaccional: Order Code + Verificacion]
```

---

## 2. Mitigacion de Vulnerabilidades y Logica Defensiva

### Mitigacion de Alteracion de Precios (Price Tampering - VULN-01)
En aplicaciones de comercio electronico convencionales, calcular los subtotales exclusivamente en el navegador expone la transaccion a manipulacion maliciosa del arbol de estado o peticiones HTTP. FakeStore mitiga esta superficie de ataque:
- El cliente envia unicamente identificadores de producto (`id`), talla seleccionada y cantidad requerida.
- La Server Action extrae los precios base y porcentajes de descuento vigentes directamente de la capa de datos del servidor, recalculando el monto total de forma autoritativa.
- Se ejecuta una comprobacion estricta de stock disponible (`dbProduct.stock < item.quantity`) antes de confirmar cualquier orden.

---

## 3. Pipeline Resiliente de Sincronizacion Cambiaria (BCV Mirror Pipeline)

Para operar en entornos con volatilidad cambiaria sin interrumpir el flujo transaccional, el modulo `bcvRate.js` implementa una estrategia de redundancia en tres niveles:

1. Fuente Primaria: Consulta a la API oficial de cotizaciones con directiva `cache: 'no-store'` para evitar respuestas desactualizadas por almacenamiento intermedio.
2. Mirror Secundario: Si el proveedor principal no responde o retorna un codigo de error HTTP, el flujo conmuta transparentemente a una API secundaria de respaldo (PyDolarVe) extrayendo los nodos de monitoreo.
3. Fallback de Contingencia: En caso de perdida total de conectividad externa, el sistema utiliza un valor predefinido de seguridad (`DEFAULT_BCV_RATE`), asegurando la continuidad operativa del proceso de compra.

---

## 4. Validacion Estricta de Esquemas en Runtime (Zod)

El sistema emplea Zod para validar la integridad de las estructuras de datos antes de permitir la persistencia o el despacho de ordenes:

- Esquema de Checkout (`checkoutSchema`): Valida longitud de nombres, seleccion obligatoria de metodos de pago y envio, y una expresion regular defensiva para operadoras telefonicas locales:
  `phoneRegex = /^(\+?58|0)?(412|414|424|416|426|2\d{2})[0-9]{7}$/`
- Esquema de Producto (`productSchema`): Valida formato de codigos SKU (`/^[A-Za-z0-9_-]+$/`), URLs de imagenes, rangos de precios positivos y la distribucion desagregada de stock por tallas (`sizeStock: { S, M, L, XL }`).

---

## 5. Gestion de Estado Global y UI Reactiva

- Store Centralizado (`StoreContext.jsx`): Administra el ciclo de vida del carrito de compras, el estado de los modales de busqueda, checkout e inventario administrativo, sincronizando las mutaciones con `LocalStorage` para evitar perdida de sesion ante recargas.
- Optimizacion de Renderizado: Uso de `clsx` y `tailwind-merge` para fusion dinamica de clases sin colisiones de especificidad en CSS.
- Carga Selectiva de Activos: Iconografia vectorizada importada de forma granular desde `lucide-react`, eliminando peso muerto en los paquetes finales de produccion (Tree-shaking).
