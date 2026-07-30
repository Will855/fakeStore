'use client';

import React from 'react';
import Hero from '@/components/home/Hero';
import NewCollection from '@/components/home/NewCollection';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import SeasonalOffers from '@/components/home/SeasonalOffers';
import ContactSection from '@/components/home/ContactSection';
import FAQSection from '@/components/home/FAQSection';
import { useStore } from '@/context/StoreContext';

export default function Home() {
  const { homeSections } = useStore();

  const sectionComponents = {
    newCollection: <NewCollection key="newCollection" />,
    categories: <Categories key="categories" />,
    featuredProducts: <FeaturedProducts key="featuredProducts" />,
    seasonalOffers: <SeasonalOffers key="seasonalOffers" />,
    contactSection: <ContactSection key="contactSection" />,
    faqSection: <FAQSection key="faqSection" />,
  };

  return (
    <div className="space-y-0">
      <Hero />
      
      {/* Renderizado dinámico según el orden y visibilidad configurados en el Admin */}
      {homeSections
        .filter((sec) => sec.visible)
        .map((sec) => sectionComponents[sec.id] || null)}
    </div>
  );
}
