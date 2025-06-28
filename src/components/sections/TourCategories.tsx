// src/components/sections/TourCategories.tsx
"use client";

import React from 'react';
import Image from 'next/image';

const categories = [
  {
    id: 1,
    name: 'Airport Transfer',
    image: '/images/categories/airport-transfer.webp',
  },
  {
    id: 2,
    name: 'Golden Circle',
    image: '/images/categories/golden-circle.webp',
  },
  {
    id: 3,
    name: 'Adventure Bus',
    image: '/images/categories/adventure-bus.webp',
  },
  {
    id: 4,
    name: 'Volcano Tours',
    image: '/images/categories/volcano-tours.webp',
  },
  {
    id: 5,
    name: 'Hop On Hop Off Sightseeing',
    image: '/images/categories/hop-on-hop-off.webp',
  },
  {
    id: 6,
    name: 'Northern Lights',
    image: '/images/categories/northern-lights.webp',
  },
  {
    id: 7,
    name: 'Hot Springs, Spas & Lagoons',
    image: '/images/categories/hot-springs.webp',
  },
  {
    id: 8,
    name: 'Small Group',
    image: '/images/categories/small-group.webp',
  },
  {
    id: 9,
    name: 'Glacier & Ice Cave Tours',
    image: '/images/categories/glacier-tours.webp',
  },
  {
    id: 10,
    name: 'Super Jeep Tours',
    image: '/images/categories/super-jeep.webp',
  },
  {
    id: 11,
    name: 'Blue Lagoon',
    image: '/images/categories/blue-lagoon.webp',
  }
];

const TourCategories = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">SEARCH BY TOUR CATEGORY:</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3]">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
            </div>
            
            {/* Category Name */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90">
              <h3 className="text-center font-medium">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TourCategories;
