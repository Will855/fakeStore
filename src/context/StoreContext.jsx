'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import initialProductsData from '@/data/initialProducts.json';
import { fetchCurrentBCVRate, DEFAULT_BCV_RATE } from '@/lib/bcvRate';

const StoreContext = createContext();

const DEFAULT_CATEGORIES = [
  { id: 'vestidos', name: 'Vestidos' },
  { id: 'jeans', name: 'Jeans & Shorts' },
  { id: 'blusas', name: 'Blusas & Tops' },
  { id: 'conjuntos', name: 'Conjuntos' },
  { id: 'carteras', name: 'Carteras' },
  { id: 'playero', name: 'Playero' },
  { id: 'fit', name: 'Divas Fit' },
];

const DEFAULT_HOME_SECTIONS = [
  { id: 'newCollection', name: 'Nueva Colección (Recién Llegados)', visible: true },
  { id: 'categories', name: 'Categorías de Moda', visible: true },
  { id: 'featuredProducts', name: 'Prendas Destacadas (Top)', visible: true },
  { id: 'seasonalOffers', name: 'Ofertas de Temporada', visible: true },
  { id: 'contactSection', name: 'Sección de Contacto', visible: true },
  { id: 'faqSection', name: 'Preguntas Frecuentes (FAQ)', visible: true },
];

const DEFAULT_HERO_CONFIG = {
  tagline: 'Boutique Femenina • Venezuela',
  title: 'FAKESTORE',
  subtitle: 'Nueva Colección 2026',
  description: 'Descubre nuestra línea exclusiva de vestidos, jeans, blusas, bodys y ropa deportiva. Precios en USD con conversión oficial al BCV.',
  bgImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85',
};

const DEFAULT_FOOTER_CONFIG = {
  aboutText: 'Tu boutique de moda femenina en Venezuela. Prendas de vestir, vestidos, jeans y conjuntos con conversión oficial a Bolívares en tiempo real según el BCV.',
  address: 'Caracas, Venezuela (Pickup en Chacao / Las Mercedes)',
  hours: 'Lunes a Sábado: 8:00 AM - 7:00 PM',
};

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(initialProductsData);
  const [cart, setCart] = useState([]);
  const [bcvRate, setBcvRate] = useState(DEFAULT_BCV_RATE);
  const [ownerPhone, setOwnerPhone] = useState('+584141234567');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Configuración CMS Dinámica
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [homeSections, setHomeSections] = useState(DEFAULT_HOME_SECTIONS);
  const [heroConfig, setHeroConfig] = useState(DEFAULT_HERO_CONFIG);
  const [footerConfig, setFooterConfig] = useState(DEFAULT_FOOTER_CONFIG);

  // Estado Toast
  const [toast, setToast] = useState({ show: false, title: '', message: '' });

  // Estado Pedido en Progreso
  const [activeOrder, setActiveOrder] = useState(null);
  const [showActiveOrderModal, setShowActiveOrderModal] = useState(false);

  // Helper Toast
  const showNotification = (title, message) => {
    setToast({ show: true, title, message });
    setTimeout(() => {
      setToast({ show: false, title: '', message: '' });
    }, 2500);
  };

  // Carga de Estado Local Persistente
  const loadLocalState = () => {
    try {
      const savedProducts = localStorage.getItem('fakestore_products_v3');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(initialProductsData);
        localStorage.setItem('fakestore_products_v3', JSON.stringify(initialProductsData));
      }

      const savedCart = localStorage.getItem('fakestore_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedPhone = localStorage.getItem('fakestore_phone');
      if (savedPhone) setOwnerPhone(savedPhone);

      const savedOrder = localStorage.getItem('fakestore_active_order');
      if (savedOrder) setActiveOrder(JSON.parse(savedOrder));

      // Cargar configuraciones CMS
      const savedCategories = localStorage.getItem('fakestore_categories');
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedSections = localStorage.getItem('fakestore_home_sections');
      if (savedSections) setHomeSections(JSON.parse(savedSections));

      const savedHero = localStorage.getItem('fakestore_hero_config');
      if (savedHero) setHeroConfig(JSON.parse(savedHero));

      const savedFooter = localStorage.getItem('fakestore_footer_config');
      if (savedFooter) setFooterConfig(JSON.parse(savedFooter));

    } catch (error) {
      console.error('Error al cargar estado desde localStorage:', error);
      setProducts(initialProductsData);
    }
  };

  useEffect(() => {
    loadLocalState();

    const handleStorageChange = (e) => {
      if (['fakestore_products_v3', 'fakestore_cart', 'fakestore_categories', 'fakestore_home_sections', 'fakestore_hero_config'].includes(e.key)) {
        loadLocalState();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    fetchCurrentBCVRate().then(rate => {
      if (rate) setBcvRate(rate);
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Persistir configuraciones CMS con re-asignación automática de categorías eliminadas
  const updateCategories = (newCats) => {
    setCategories(newCats);
    localStorage.setItem('fakestore_categories', JSON.stringify(newCats));

    if (newCats.length > 0) {
      const validCatIds = newCats.map(c => c.id);
      const fallbackCatId = newCats[0].id;

      // Re-asignar productos cuya categoría fue eliminada
      const updatedProds = products.map(prod => {
        if (!validCatIds.includes(prod.category)) {
          return { ...prod, category: fallbackCatId };
        }
        return prod;
      });

      updateProductsState(updatedProds);
    }
  };

  const updateHomeSections = (newSections) => {
    setHomeSections(newSections);
    localStorage.setItem('fakestore_home_sections', JSON.stringify(newSections));
  };

  const updateHeroConfig = (newHero) => {
    setHeroConfig(newHero);
    localStorage.setItem('fakestore_hero_config', JSON.stringify(newHero));
  };

  const updateFooterConfig = (newFooter) => {
    setFooterConfig(newFooter);
    localStorage.setItem('fakestore_footer_config', JSON.stringify(newFooter));
  };

  const updateProductsState = (newProducts) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('fakestore_products_v3', JSON.stringify(newProducts));
    } catch (e) {
      console.error('Error guardando productos:', e);
    }
  };

  const updateCartState = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('fakestore_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error('Error guardando carrito:', e);
    }
  };

  // Acciones Carrito
  const addToCart = (product, selectedSize = 'M', quantity = 1) => {
    if (activeOrder && activeOrder.status === 'pending_confirmation') {
      setShowActiveOrderModal(true);
      return;
    }

    const availableForSize = product.sizeStock && typeof product.sizeStock[selectedSize] === 'number'
      ? product.sizeStock[selectedSize]
      : product.stock;

    if (availableForSize <= 0) {
      alert(`La talla ${selectedSize} no tiene stock disponible.`);
      return;
    }

    const itemKey = `${product.id}-${selectedSize}`;
    const currentInCart = cart.find(item => item.itemKey === itemKey)?.quantity || 0;

    if (currentInCart + quantity > availableForSize) {
      alert(`No puedes agregar más unidades en Talla ${selectedSize}. Stock disponible: ${availableForSize}`);
      return;
    }

    const existingIndex = cart.findIndex(item => item.itemKey === itemKey);
    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...cart, { itemKey, product, selectedSize, quantity }];
    }
    updateCartState(updatedCart);
    showNotification('Agregado al carrito', `${product.title} (Talla ${selectedSize})`);
  };

  const removeFromCart = (itemKey) => {
    const updatedCart = cart.filter(item => (item.itemKey || item.product.id) !== itemKey);
    updateCartState(updatedCart);
  };

  const updateCartQuantity = (itemKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemKey);
      return;
    }

    const updatedCart = cart.map(item =>
      (item.itemKey || item.product.id) === itemKey ? { ...item, quantity } : item
    );
    updateCartState(updatedCart);
  };

  const clearCart = () => {
    updateCartState([]);
  };

  // Descuento Atómico de Stock por Talla
  const processOrderAndDeductStock = (orderData) => {
    const updatedProducts = products.map(prod => {
      const cartItemsForProd = cart.filter(item => item.product.id === prod.id);
      if (cartItemsForProd.length > 0) {
        let newSizeStock = { ...(prod.sizeStock || { S: 0, M: prod.stock, L: 0, XL: 0 }) };
        let totalDeducted = 0;

        cartItemsForProd.forEach(item => {
          const sz = item.selectedSize || 'M';
          const currentSzStock = newSizeStock[sz] || 0;
          newSizeStock[sz] = Math.max(0, currentSzStock - item.quantity);
          totalDeducted += item.quantity;
        });

        const newTotalStock = Math.max(0, prod.stock - totalDeducted);

        return {
          ...prod,
          stock: newTotalStock,
          sizeStock: newSizeStock,
        };
      }
      return prod;
    });

    updateProductsState(updatedProducts);

    const newActiveOrder = {
      orderCode: orderData.orderCode,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      items: cart,
      totalUSD: cartSubtotalUSD,
      totalVES: cartSubtotalVES,
      status: 'pending_confirmation',
      createdAt: new Date().toISOString(),
    };

    setActiveOrder(newActiveOrder);
    localStorage.setItem('fakestore_active_order', JSON.stringify(newActiveOrder));
    clearCart();
  };

  const cancelActiveOrder = () => {
    setActiveOrder(null);
    localStorage.removeItem('fakestore_active_order');
    setShowActiveOrderModal(false);
  };

  const restoreActiveOrderToCart = () => {
    if (activeOrder && activeOrder.items) {
      setCart(activeOrder.items);
      localStorage.setItem('fakestore_cart', JSON.stringify(activeOrder.items));
      cancelActiveOrder();
      setIsCartOpen(true);
    }
  };

  // Acciones de Productos Admin
  const addProduct = (newProdData) => {
    const defaultCat = categories && categories.length > 0 ? categories[0].id : 'vestidos';
    const sStock = newProdData.sizeStock || {
      S: parseInt(newProdData.stockS || 0, 10),
      M: parseInt(newProdData.stockM || 0, 10),
      L: parseInt(newProdData.stockL || 0, 10),
      XL: parseInt(newProdData.stockXL || 0, 10),
    };
    const calcTotalStock = Object.values(sStock).reduce((a, b) => a + b, 0);

    const newProduct = {
      id: `prod-${Date.now()}`,
      sku: newProdData.sku || `ED-PROD-${Math.floor(100 + Math.random() * 900)}`,
      title: newProdData.title,
      description: newProdData.description || '',
      priceUSD: parseFloat(newProdData.priceUSD),
      category: newProdData.category || defaultCat,
      image: newProdData.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
      stock: calcTotalStock > 0 ? calcTotalStock : (parseInt(newProdData.stock, 10) || 0),
      sizeStock: sStock,
      measurements: newProdData.measurements || '',
      isNew: !!newProdData.isNew,
      isFeatured: !!newProdData.isFeatured,
      isOffer: !!newProdData.isOffer,
      discountPercentage: parseInt(newProdData.discountPercentage, 10) || 0,
    };
    updateProductsState([newProduct, ...products]);
  };

  const updateProduct = (id, updatedFields) => {
    const updatedProducts = products.map(prod =>
      prod.id === id ? { ...prod, ...updatedFields } : prod
    );
    updateProductsState(updatedProducts);
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter(prod => prod.id !== id);
    updateProductsState(updatedProducts);
  };

  const updateStock = (id, newStock) => {
    updateProduct(id, { stock: Math.max(0, parseInt(newStock, 10)) });
  };

  const handleSetOwnerPhone = (phone) => {
    setOwnerPhone(phone);
    localStorage.setItem('fakestore_phone', phone);
  };

  const cartSubtotalUSD = cart.reduce((acc, item) => {
    const effectivePrice = item.product.isOffer && item.product.discountPercentage > 0
      ? item.product.priceUSD * (1 - item.product.discountPercentage / 100)
      : item.product.priceUSD;
    return acc + (effectivePrice * item.quantity);
  }, 0);

  const cartSubtotalVES = cartSubtotalUSD * bcvRate;
  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      bcvRate,
      ownerPhone,
      isCartOpen,
      setIsCartOpen,
      isSearchOpen,
      setIsSearchOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      activeOrder,
      showActiveOrderModal,
      setShowActiveOrderModal,
      toast,
      showNotification,
      categories,
      updateCategories,
      homeSections,
      updateHomeSections,
      heroConfig,
      updateHeroConfig,
      footerConfig,
      updateFooterConfig,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      processOrderAndDeductStock,
      cancelActiveOrder,
      restoreActiveOrderToCart,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      setBcvRate,
      setOwnerPhone: handleSetOwnerPhone,
      cartSubtotalUSD,
      cartSubtotalVES,
      cartTotalItems
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore debe ser usado dentro de StoreProvider');
  }
  return context;
}
