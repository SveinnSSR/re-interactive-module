// src/components/sections/AirportTransfer.tsx
"use client";

import React from 'react';
import Image from 'next/image';

const AirportTransfer = () => {
  return (
    <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-8">AIRPORT TRANSFER</h2>
      
      <div className="relative rounded-[24px] overflow-hidden shadow-xl">
        {/* Content Overlay - Moved up */}
        <div className="absolute z-30 p-12 w-full bg-gradient-to-b from-[#1a2744]/70 to-transparent">
          <p className="text-white text-xl font-light leading-relaxed max-w-xl mb-8">
            The Flybus operates in connection with all arriving and 
            departing flights at Keflavík International Airport (KEF).
          </p>
          <button className="bg-[#f87171] hover:bg-[#ef4444] text-white px-8 py-3 rounded-md font-medium transition-all duration-300 hover:shadow-lg">
            Book Your Transfer Now
          </button>
        </div>

        {/* Full Image - Updated height */}
        <div className="relative w-full h-[600px]">
          <Image
            src="/images/sections/airport-transfer/fleet.webp"
            alt="Reykjavik Excursions Fleet"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default AirportTransfer;
