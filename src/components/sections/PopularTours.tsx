// src/components/sections/PopularTours.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const tours = [
  {
    id: 1,
    image: '/images/popular-tours/south-coast.webp',
    category: 'SOUTH COAST',
    name: 'South Coast Wonders',
    originalPrice: '15.499 ISK',
    discountedPrice: '13.174 ISK'
  },
  {
    id: 2,
    image: '/images/popular-tours/snaefelssnes.webp',
    category: 'SIGHTSEEING TOURS',
    name: 'Wonders of Snaefellsnes National Park - Small Group Tour',
    originalPrice: '18.999 ISK',
    discountedPrice: '16.149 ISK'
  },
  {
    id: 3,
    image: '/images/popular-tours/golden-circle.webp',
    category: 'GOLDEN CIRCLE',
    name: 'The Golden Circle & Friðheimar Greenhouse',
    originalPrice: '11.599 ISK',
    discountedPrice: '9.859 ISK'
  },
  {
    id: 4,
    image: '/images/popular-tours/golden-circle-direct.webp',
    category: 'GOLDEN CIRCLE',
    name: 'Golden Circle Direct',
    originalPrice: '10.599 ISK',
    discountedPrice: '9.009 ISK'
  }
];

const PopularTours = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = { mobile: 1, tablet: 2, desktop: 4 };
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + itemsPerPage.desktop >= tours.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? tours.length - itemsPerPage.desktop : prevIndex - 1
    );
  };

  // Calculate visible tours based on screen size and current index
  const visibleTours = tours.slice(currentIndex, currentIndex + itemsPerPage.desktop);
  
  // If we don't have enough items, add items from the beginning
  if (visibleTours.length < itemsPerPage.desktop) {
    visibleTours.push(...tours.slice(0, itemsPerPage.desktop - visibleTours.length));
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">POPULAR TOURS</h2>
      
      <div className="relative">
        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleTours.map((tour) => (
            <div 
              key={tour.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full">
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="uppercase text-sm font-semibold text-gray-600 mb-2">
                  {tour.category}
                </div>
                <h3 className="font-medium text-lg mb-4 line-clamp-2">
                  {tour.name}
                </h3>
                <div>
                  <span className="line-through text-gray-400 mr-2">
                    {tour.originalPrice}
                  </span>
                  <span className="text-red-500 font-semibold">
                    {tour.discountedPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Previous tours"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Next tours"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};

export default PopularTours;
